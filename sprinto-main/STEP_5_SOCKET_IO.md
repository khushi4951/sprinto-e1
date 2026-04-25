/**
 * STEP 5: REAL-TIME UPDATES WITH SOCKET.IO
 * 
 * WebSocket implementation for live kanban board & sprint updates
 */

// ==============================================
// INSTALLATION
// ==============================================

/*
npm install socket.io socket.io-client

Socket.io abstracts WebSocket complexity:
- Auto-fallback to polling if WebSocket unavailable
- Built-in rooms for targeted broadcasts
- Message acknowledgments
- Binary data support
*/


// ==============================================
// server.js (SOCKET.IO INTEGRATION)
// ==============================================

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');  // NEW: Need native http server
const { Server } = require('socket.io');  // NEW

const { logger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { authGuard, optionalAuth } = require('./middleware/authentication');

const authRoutes = require('./routes/authRoutes');
const sprintRoutes = require('./routes/sprintRoutes');
const issueRoutes = require('./routes/issueRoutes');
const teamRoutes = require('./routes/teamRoutes');
const pageRoutes = require('./routes/pageRoutes');

const { connectDB } = require('./config/database');  // MongoDB
const setupSocketHandlers = require('./socket-handlers');  // NEW

const app = express();
const server = http.createServer(app);  // NEW: Wrap with HTTP
const io = new Server(server, {  // NEW: Create Socket.io server
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],  // Allow CORS
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Initialize databases
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to initialize databases:', err);
    process.exit(1);
  }
})();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(optionalAuth);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/team', teamRoutes);
app.use('/', pageRoutes);

// Socket.io handlers
setupSocketHandlers(io);  // NEW: Setup all socket events

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {  // Changed from app.listen
  console.log(\`✓ Server running on http://localhost:\${PORT}\`);
  console.log(\`✓ WebSocket listening on ws://localhost:\${PORT}\`);
});


// ==============================================
// socket-handlers/index.js
// ==============================================

/**
 * Consolidate all socket event handlers
 * Each handler is in separate file for organization
 */

const setupIssueEvents = require('./issueEvents');
const setupSprintEvents = require('./sprintEvents');
const setupUserPresenceEvents = require('./userPresence');

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('✓ Client connected:', socket.id);
    
    // Setup handlers for different domains
    setupUserPresenceEvents(io, socket);
    setupIssueEvents(io, socket);
    setupSprintEvents(io, socket);
    
    socket.on('disconnect', () => {
      console.log('✗ Client disconnected:', socket.id);
    });
  });
}

module.exports = setupSocketHandlers;


// ==============================================
// socket-handlers/userPresence.js
// ==============================================

/**
 * Track online users
 * Emit when user joins/leaves
 */

function setupUserPresenceEvents(io, socket) {
  
  socket.on('userOnline', (data) => {
    const { userId, userName } = data;
    
    // Store userId in socket for later reference
    socket.userId = userId;
    socket.userName = userName;
    
    // Join user to personal room (for direct messages)
    socket.join(\`user:\${userId}\`);
    
    // Broadcast to all connected clients
    io.emit('userPresenceUpdated', {
      userId,
      userName,
      status: 'online',
      timestamp: new Date().toISOString()
    });
    
    console.log(\`✓ User online: \${userName} (\${userId})\`);
  });
  
  socket.on('userOffline', (data) => {
    const { userId, userName } = data;
    
    io.emit('userPresenceUpdated', {
      userId,
      userName,
      status: 'offline',
      timestamp: new Date().toISOString()
    });
    
    console.log(\`✗ User offline: \${userName} (\${userId})\`);
  });
}

module.exports = setupUserPresenceEvents;


// ==============================================
// socket-handlers/issueEvents.js
// ==============================================

/**
 * Real-time issue updates
 * - Issue moved in kanban
 * - Issue status changed
 * - Issue assigned/unassigned
 */

const Issue = require('../models/Issue');

function setupIssueEvents(io, socket) {
  
  /**
   * Join user to sprint room
   * So they only get updates for sprints they're working on
   */
  socket.on('joinSprint', (sprintId) => {
    socket.join(\`sprint:\${sprintId}\`);
    console.log(\`✓ User joined sprint: \${sprintId}\`);
  });
  
  socket.on('leaveSprint', (sprintId) => {
    socket.leave(\`sprint:\${sprintId}\`);
    console.log(\`✗ User left sprint: \${sprintId}\`);
  });
  
  /**
   * Issue moved in kanban board
   * 
   * Client sends: { issueId, newStatus, sprintId }
   * Server updates DB + broadcasts
   */
  socket.on('issueMoved', async (data) => {
    try {
      const { issueId, newStatus, sprintId } = data;
      
      // Update in database
      const issue = await Issue.findByIdAndUpdate(
        issueId,
        { status: newStatus, updatedAt: new Date() },
        { new: true }
      );
      
      if (!issue) {
        socket.emit('error', { message: 'Issue not found' });
        return;
      }
      
      // Broadcast to all users in this sprint
      io.to(\`sprint:\${sprintId}\`).emit('issueMoved', {
        issueId,
        newStatus,
        title: issue.title,
        movedBy: socket.userId,
        timestamp: new Date().toISOString()
      });
      
      console.log(\`✓ Issue moved: \${issueId} → \${newStatus}\`);
    } catch (err) {
      console.error('Issue move error:', err);
      socket.emit('error', { message: 'Failed to move issue' });
    }
  });
  
  /**
   * Issue assigned to user
   */
  socket.on('issueAssigned', async (data) => {
    try {
      const { issueId, assigneeId, sprintId } = data;
      
      // Update in database
      const issue = await Issue.findByIdAndUpdate(
        issueId,
        { assigneeId, updatedAt: new Date() },
        { new: true }
      ).populate('assigneeId', 'name email');
      
      if (!issue) {
        socket.emit('error', { message: 'Issue not found' });
        return;
      }
      
      // Broadcast to sprint
      io.to(\`sprint:\${sprintId}\`).emit('issueAssigned', {
        issueId,
        assigneeId,
        assigneeName: issue.assigneeId?.name,
        title: issue.title,
        assignedBy: socket.userId,
        timestamp: new Date().toISOString()
      });
      
      // Direct notification to assigned user
      io.to(\`user:\${assigneeId}\`).emit('issueAssignedToMe', {
        issueId,
        title: issue.title
      });
      
      console.log(\`✓ Issue assigned: \${issueId} → \${assigneeId}\`);
    } catch (err) {
      console.error('Issue assignment error:', err);
      socket.emit('error', { message: 'Failed to assign issue' });
    }
  });
  
  /**
   * Issue comment added
   */
  socket.on('issueCommented', async (data) => {
    try {
      const { issueId, text, sprintId } = data;
      
      // Update in database
      const issue = await Issue.findByIdAndUpdate(
        issueId,
        {
          $push: {
            comments: {
              userId: socket.userId,
              text,
              createdAt: new Date()
            }
          },
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (!issue) {
        socket.emit('error', { message: 'Issue not found' });
        return;
      }
      
      // Broadcast to sprint
      io.to(\`sprint:\${sprintId}\`).emit('issueCommented', {
        issueId,
        title: issue.title,
        comment: text,
        commentedBy: socket.userName,
        timestamp: new Date().toISOString()
      });
      
      console.log(\`✓ Comment added to issue: \${issueId}\`);
    } catch (err) {
      console.error('Comment error:', err);
      socket.emit('error', { message: 'Failed to add comment' });
    }
  });
  
  /**
   * Issue deleted
   */
  socket.on('issueDeleted', async (data) => {
    try {
      const { issueId, sprintId } = data;
      
      await Issue.findByIdAndDelete(issueId);
      
      // Broadcast to sprint
      io.to(\`sprint:\${sprintId}\`).emit('issueDeleted', {
        issueId,
        deletedBy: socket.userId,
        timestamp: new Date().toISOString()
      });
      
      console.log(\`✓ Issue deleted: \${issueId}\`);
    } catch (err) {
      console.error('Delete error:', err);
      socket.emit('error', { message: 'Failed to delete issue' });
    }
  });
}

module.exports = setupIssueEvents;


// ==============================================
// socket-handlers/sprintEvents.js
// ==============================================

/**
 * Real-time sprint updates
 * - Sprint status changed
 * - Sprint completed
 */

const Sprint = require('../models/Sprint');

function setupSprintEvents(io, socket) {
  
  socket.on('sprintStatusChanged', async (data) => {
    try {
      const { sprintId, newStatus } = data;
      
      // Update in database
      const sprint = await Sprint.findByIdAndUpdate(
        sprintId,
        { status: newStatus, updatedAt: new Date() },
        { new: true }
      );
      
      if (!sprint) {
        socket.emit('error', { message: 'Sprint not found' });
        return;
      }
      
      // Broadcast to all users
      io.emit('sprintStatusChanged', {
        sprintId,
        name: sprint.name,
        status: newStatus,
        changedBy: socket.userId,
        timestamp: new Date().toISOString()
      });
      
      console.log(\`✓ Sprint status changed: \${sprintId} → \${newStatus}\`);
    } catch (err) {
      console.error('Sprint update error:', err);
      socket.emit('error', { message: 'Failed to update sprint' });
    }
  });
  
  socket.on('sprintCompleted', async (data) => {
    try {
      const { sprintId } = data;
      
      const sprint = await Sprint.findByIdAndUpdate(
        sprintId,
        {
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (!sprint) {
        socket.emit('error', { message: 'Sprint not found' });
        return;
      }
      
      // Broadcast to all
      io.emit('sprintCompleted', {
        sprintId,
        name: sprint.name,
        completedBy: socket.userId,
        issues: sprint.issues?.length || 0,
        timestamp: new Date().toISOString()
      });
      
      console.log(\`✓ Sprint completed: \${sprintId}\`);
    } catch (err) {
      console.error('Sprint completion error:', err);
      socket.emit('error', { message: 'Failed to complete sprint' });
    }
  });
}

module.exports = setupSprintEvents;


// ==============================================
// public/js/socket-client.js (FRONTEND)
// ==============================================

\`
// Initialize socket connection
const socket = io();

// =====  USER PRESENCE =====
function notifyOnline() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  socket.emit('userOnline', {
    userId: user.userId,
    userName: user.name
  });
}

socket.on('userPresenceUpdated', (data) => {
  console.log(\`User \${data.userName} is \${data.status}\`);
  updateUserList(data);
});

// =====  JOIN SPRINT =====
function joinSprintRoom(sprintId) {
  socket.emit('joinSprint', sprintId);
  console.log('Joined sprint:', sprintId);
}

// =====  ISSUE MOVEMENT IN KANBAN =====
function moveIssue(issueId, newStatus, sprintId) {
  socket.emit('issueMoved', {
    issueId,
    newStatus,
    sprintId
  });
}

socket.on('issueMoved', (data) => {
  console.log(\`Issue moved: \${data.title} → \${data.newStatus}\`);
  updateKanbanUI(data);
});

// =====  ASSIGN ISSUE =====
function assignIssue(issueId, assigneeId, sprintId) {
  socket.emit('issueAssigned', {
    issueId,
    assigneeId,
    sprintId
  });
}

socket.on('issueAssigned', (data) => {
  console.log(\`Issue assigned: \${data.title} → \${data.assigneeName}\`);
  updateIssueUI(data);
});

socket.on('issueAssignedToMe', (data) => {
  showNotification(\`You've been assigned: \${data.title}\`);
});

// =====  ISSUE COMMENT =====
function addComment(issueId, text, sprintId) {
  socket.emit('issueCommented', {
    issueId,
    text,
    sprintId
  });
}

socket.on('issueCommented', (data) => {
  console.log(\`Comment on \${data.title}: \${data.comment}\`);
  updateIssueComments(data);
});

// =====  SPRINT STATUS =====
socket.on('sprintStatusChanged', (data) => {
  console.log(\`Sprint \${data.name} is now \${data.status}\`);
  updateSprintUI(data);
});

socket.on('sprintCompleted', (data) => {
  showNotification(\`Sprint "\${data.name}" completed! \${data.issues} issues done.\`);
  reloadDashboard();
});

// Error handling
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
  showErrorNotification(data.message);
});

// Cleanup on disconnect
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
\`


// ==============================================
// VIVA QUESTIONS
// ==============================================
/*

Q1: How does Socket.io differ from HTTP polling?

A1:
  HTTP Polling (old way):
  - Client sends request every 1 second: "Any updates?"
  - Server responds even if no updates
  - Wasteful (network traffic)
  
  Socket.io (modern way):
  - Open persistent connection (WebSocket)
  - Server sends updates immediately when they happen
  - Bidirectional (client ↔ server anytime)
  - More efficient (no polling overhead)


Q2: How do you broadcast to specific users?

A2:
  // Send to all connected clients
  io.emit('eventName', data)
  
  // Send to all EXCEPT sender
  socket.broadcast.emit('eventName', data)
  
  // Send to specific room
  io.to('room-name').emit('eventName', data)
  
  // Send to specific user
  io.to(\`user:\${userId}\`).emit('eventName', data)
  
  For Sprinto: Send issue update only to users in that sprint room


Q3: How do you create and manage rooms?

A3:
  socket.join('sprint:5')    // Join room
  socket.leave('sprint:5')   // Leave room
  
  socket.to('sprint:5').emit('event')  // Send to room
  
  Use case:
  - User opens sprint board → join sprint room
  - Multiple users in same sprint → see updates from each other
  - User closes sprint → leave room
  - No more updates when not viewing


Q4: How does socket authentication work?

A4:
  Option 1: Token in auth headers
  const socket = io({
    auth: { token: localStorage.getItem('token') }
  })
  
  Option 2: Token in cookie (auto sent)
  Cookie set by server → auto included in WebSocket upgrade
  
  Server verification:
  socket.on('connection', (socket) => {
    const token = socket.handshake.auth.token
    // Verify token before allowing connection
  })


Q5: What happens if WebSocket connection fails?

A5:
  Socket.io has built-in fallback:
  1. Try WebSocket (best)
  2. If fails, try HTTP long-polling (slower)
  3. If fails, try XHR polling (slowest)
  
  Socket.io automatically handles fallback.
  For user: Transparently works, just slower.


Q6: How do you ensure real-time updates sync with DB?

A6:
  Flow:
  1. Client moves issue via UI: socket.emit('issueMoved')
  2. Server receives and updates MongoDB
  3. Server broadcasts to all clients in that room
  4. Other clients receive broadcast and update UI
  5. All clients in sync with DB
  
  Key: Update DB first, then broadcast!
  (Not: broadcast first, then update DB)


Q7: What's the difference between emit() and to().emit()?

A7:
  socket.emit() → Send to that one socket
  socket.broadcast.emit() → Send to all EXCEPT that socket
  io.emit() → Send to ALL sockets
  io.to('room').emit() → Send to everyone in room
  socket.to('room').emit() → Send to room EXCEPT sender
  
  For Sprinto kanban:
  io.to(\`sprint:\${sprintId}\`).emit('issueMoved', data)
  // All users in sprint see update

*/
\`;

// File exports
module.exports = {
  setupSocketHandlers,
  issueEvents: 'See socket-handlers/issueEvents.js',
  sprintEvents: 'See socket-handlers/sprintEvents.js'
};
