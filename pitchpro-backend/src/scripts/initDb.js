require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const {
  User,
  Team,
  Season,
  TacticTemplate,
  syncAllIndexes,
} = require('../models');

const initDatabase = async () => {
  console.log('========================================');
  console.log('   PITCHPRO DATABASE INITIALIZATION');
  console.log('========================================');

  await connectDB();

  // 1. Sync indexes
  await syncAllIndexes();

  // 2. Ensure initial default Team exists
  let defaultTeam = await Team.findOne();
  if (!defaultTeam) {
    defaultTeam = await Team.create({
      name: 'PitchPro FC',
      timezone: 'Asia/Ho_Chi_Minh',
      defaultVenue: 'Sân vận động PitchPro',
    });
    console.log(`[Init] Created default team: "${defaultTeam.name}" (ID: ${defaultTeam._id})`);
  } else {
    console.log(`[Init] Found existing team: "${defaultTeam.name}" (ID: ${defaultTeam._id})`);
  }

  // 3. Ensure initial Admin account exists (Section 2.2)
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@pitchpro.local';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@PitchPro2026!';

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const passwordHash = await User.hashPassword(adminPassword);
    adminUser = await User.create({
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      mustChangePassword: true, // Must change on first login as per spec
    });
    console.log(`[Init] Created initial Admin account:`);
    console.log(`       - Email: ${adminEmail}`);
    console.log(`       - Password: ${adminPassword}`);
    console.log(`       - Role: ADMIN`);
    console.log(`       - Must Change Password: true`);
  } else {
    console.log(`[Init] Admin account already exists: ${adminEmail}`);
  }

  // 4. Create standard default Tactic Templates (FR-L01: 4-3-3, 4-2-3-1, 3-5-2)
  const defaultTactics = [
    {
      teamId: defaultTeam._id,
      name: '4-3-3 Tấn công',
      formation: '4-3-3',
      slots: [
        { role: 'GK', x: 50, y: 90 },
        { role: 'LB', x: 15, y: 70 },
        { role: 'CB', x: 38, y: 75 },
        { role: 'CB', x: 62, y: 75 },
        { role: 'RB', x: 85, y: 70 },
        { role: 'DM', x: 50, y: 55 },
        { role: 'CM', x: 32, y: 42 },
        { role: 'CM', x: 68, y: 42 },
        { role: 'LW', x: 18, y: 20 },
        { role: 'ST', x: 50, y: 15 },
        { role: 'RW', x: 82, y: 20 },
      ],
    },
    {
      teamId: defaultTeam._id,
      name: '4-2-3-1 Cân bằng',
      formation: '4-2-3-1',
      slots: [
        { role: 'GK', x: 50, y: 90 },
        { role: 'LB', x: 15, y: 70 },
        { role: 'CB', x: 38, y: 75 },
        { role: 'CB', x: 62, y: 75 },
        { role: 'RB', x: 85, y: 70 },
        { role: 'DM', x: 35, y: 55 },
        { role: 'DM', x: 65, y: 55 },
        { role: 'AM', x: 50, y: 35 },
        { role: 'LW', x: 20, y: 28 },
        { role: 'RW', x: 80, y: 28 },
        { role: 'ST', x: 50, y: 15 },
      ],
    },
    {
      teamId: defaultTeam._id,
      name: '3-5-2 Kiểm soát',
      formation: '3-5-2',
      slots: [
        { role: 'GK', x: 50, y: 90 },
        { role: 'CB', x: 28, y: 75 },
        { role: 'CB', x: 50, y: 78 },
        { role: 'CB', x: 72, y: 75 },
        { role: 'LWB', x: 12, y: 48 },
        { role: 'DM', x: 50, y: 58 },
        { role: 'CM', x: 35, y: 45 },
        { role: 'CM', x: 65, y: 45 },
        { role: 'RWB', x: 88, y: 48 },
        { role: 'ST', x: 38, y: 18 },
        { role: 'ST', x: 62, y: 18 },
      ],
    },
  ];

  for (const t of defaultTactics) {
    const existing = await TacticTemplate.findOne({ teamId: t.teamId, name: t.name });
    if (!existing) {
      await TacticTemplate.create(t);
      console.log(`[Init] Created default tactic template: ${t.name}`);
    }
  }

  console.log('========================================');
  console.log('   DATABASE INITIALIZATION COMPLETED!   ');
  console.log('========================================');

  await mongoose.disconnect();
  process.exit(0);
};

initDatabase().catch((err) => {
  console.error('[Init] Database initialization failed:', err);
  process.exit(1);
});

