import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Job } from './models/Job';
import { Candidate } from './models/Candidate';
import { Application } from './models/Application';
import { Account } from './models/Account';
import { Opportunity } from './models/Opportunity';

async function seed() {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'Admin',
      passwordHash
    });
    console.log('✅ Admin user created: admin@example.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create sample jobs
  const jobsData = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      openings: 2,
      status: 'Active'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      employmentType: 'Full-time',
      skills: ['Product Strategy', 'Analytics', 'Roadmapping'],
      openings: 1,
      status: 'Active'
    },
    {
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      employmentType: 'Full-time',
      skills: ['Figma', 'User Research', 'Prototyping'],
      openings: 1,
      status: 'Active'
    }
  ];

  for (const jobData of jobsData) {
    const exists = await Job.findOne({ title: jobData.title });
    if (!exists) {
      await Job.create(jobData);
    }
  }
  console.log('✅ Sample jobs created');

  // Create sample candidates
  const candidatesData = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1-555-0101',
      skills: ['JavaScript', 'React', 'Python'],
      experienceYears: 5,
      currentTitle: 'Frontend Developer',
      currentCompany: 'TechCorp',
      tags: ['React Expert', 'Team Lead']
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1-555-0102',
      skills: ['Product Management', 'Analytics', 'Strategy'],
      experienceYears: 7,
      currentTitle: 'Senior Product Manager',
      currentCompany: 'StartupXYZ',
      tags: ['B2B', 'Growth']
    },
    {
      name: 'Carol Wilson',
      email: 'carol@example.com',
      phone: '+1-555-0103',
      skills: ['Figma', 'Sketch', 'User Research'],
      experienceYears: 4,
      currentTitle: 'UX Designer',
      currentCompany: 'DesignStudio',
      tags: ['Mobile Design', 'Research']
    }
  ];

  for (const candidateData of candidatesData) {
    const exists = await Candidate.findOne({ email: candidateData.email });
    if (!exists) {
      await Candidate.create(candidateData);
    }
  }
  console.log('✅ Sample candidates created');

  // Create sample accounts
  const accountsData = [
    {
      name: 'TechCorp Inc',
      industry: 'Technology',
      owner: 'Admin User',
      notes: 'Large enterprise client with multiple hiring needs'
    },
    {
      name: 'StartupXYZ',
      industry: 'FinTech',
      owner: 'Admin User',
      notes: 'Growing startup, rapid hiring'
    }
  ];

  for (const accountData of accountsData) {
    const exists = await Account.findOne({ name: accountData.name });
    if (!exists) {
      await Account.create(accountData);
    }
  }
  console.log('✅ Sample accounts created');

  // Create sample applications (connect candidates to jobs)
  const job = await Job.findOne({ title: 'Senior Software Engineer' });
  const candidate = await Candidate.findOne({ email: 'alice@example.com' });
  
  if (job && candidate) {
    const appExists = await Application.findOne({ candidateId: candidate._id, jobId: job._id });
    if (!appExists) {
      await Application.create({
        candidateId: candidate._id,
        jobId: job._id,
        stage: 'Interview',
        notes: 'Strong technical background, good culture fit',
        stageHistory: [
          { from: 'New', to: 'Screening', at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'Initial screening passed' },
          { from: 'Screening', to: 'Interview', at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Scheduled technical interview' }
        ]
      });
    }
  }
  console.log('✅ Sample applications created');

  // Create sample opportunities
  const account = await Account.findOne({ name: 'TechCorp Inc' });
  if (account) {
    const oppExists = await Opportunity.findOne({ accountId: account._id });
    if (!oppExists) {
      await Opportunity.create({
        accountId: account._id,
        title: 'Q1 Engineering Team Expansion',
        stage: 'Qualified',
        value: 250000,
        probability: 75
      });
    }
  }
  console.log('✅ Sample opportunities created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Password: admin123');
  
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});