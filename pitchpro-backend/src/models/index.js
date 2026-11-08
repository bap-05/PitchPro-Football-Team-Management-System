const User = require('./User');
const RefreshSession = require('./RefreshSession');
const Team = require('./Team');
const Season = require('./Season');
const Player = require('./Player');
const SeasonRegistration = require('./SeasonRegistration');
const PlayerRating = require('./PlayerRating');
const Suspension = require('./Suspension');
const TacticTemplate = require('./TacticTemplate');
const Match = require('./Match');
const Lineup = require('./Lineup');
const MatchEvent = require('./MatchEvent');
const PlayerMatchStat = require('./PlayerMatchStat');
const TrainingSession = require('./TrainingSession');
const Attendance = require('./Attendance');
const Notification = require('./Notification');
const NotificationJob = require('./NotificationJob');
const AuditLog = require('./AuditLog');

const models = {
  User,
  RefreshSession,
  Team,
  Season,
  Player,
  SeasonRegistration,
  PlayerRating,
  Suspension,
  TacticTemplate,
  Match,
  Lineup,
  MatchEvent,
  PlayerMatchStat,
  TrainingSession,
  Attendance,
  Notification,
  NotificationJob,
  AuditLog,
};

// Function to synchronize indexes for all models
const syncAllIndexes = async () => {
  console.log('[MongoDB] Synchronizing indexes for all models...');
  for (const [name, model] of Object.entries(models)) {
    try {
      await model.syncIndexes();
      console.log(` - ${name}: Indexes synchronized`);
    } catch (err) {
      console.error(` - ${name}: Index sync failed: ${err.message}`);
    }
  }
};

module.exports = {
  ...models,
  syncAllIndexes,
};

