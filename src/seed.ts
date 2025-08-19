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

  const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'admin123';

  // create the 3 demo users the frontend shows
  const demoUsers: Array<{email: string; name: string; role: 'Admin'|'Recruiter'|'Sales'}> = [
    { email: 'admin@company.com',     name: 'Admin User',     role: 'Admin' },
    { email: 'recruiter@company.com', name: 'Recruiter User', role: 'Recruiter' },
    { email: 'sales@company.com',     name: 'Sales User',     role: 'Sales' },
  ];

  for (const u of demoUsers) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
      await User.create({ ...u, passwordHash });
      console.log(`✅ User created: ${u.email} / ${DEMO_PASSWORD}`);
    } else {
      console.log(`ℹ️  User already exists: ${u.email}`);
    }
  }

  // ----- sample jobs
  const jobsData = [
    { title: 'Senior Software Engineer', department: 'Engineering', location: 'San Francisco, CA',
      employmentType: 'Full-time', skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'], openings: 2, status: 'Active' },
    { title: 'Product Manager', department: 'Product', location: 'New York, NY',
      employmentType: 'Full-time', skills: ['Product Strategy', 'Analytics', 'Roadmapping'], openings: 1, status: 'Active' },
    { title: 'UX Designer', department: 'Design', location: 'Remote',
      employmentType: 'Full-time', skills: ['Figma', 'User Research', 'Prototyping'], openings: 1, status: 'Active' },
  ];
  for (const job of jobsData) if (!(await Job.findOne({ title: job.title }))) await Job.create(job);
  console.log('✅ Sample jobs created');

  // ----- sample candidates
  const candidatesData = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-0101',
      skills: ['JavaScript', 'React', 'Python'], experienceYears: 5, currentTitle: 'Frontend Developer',
      currentCompany: 'TechCorp', tags: ['React Expert', 'Team Lead'] },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '+1-555-0102',
      skills: ['Product Management', 'Analytics', 'Strategy'], experienceYears: 7,
      currentTitle: 'Senior Product Manager', currentCompany: 'StartupXYZ', tags: ['B2B', 'Growth'] },
    { name: 'Carol Wilson', email: 'carol@example.com', phone: '+1-555-0103',
      skills: ['Figma', 'Sketch', 'User Research'], experienceYears: 4,
      currentTitle: 'UX Designer', currentCompany: 'DesignStudio', tags: ['Mobile Design', 'Research'] },
  ];
  for (const c of candidatesData) if (!(await Candidate.findOne({ email: c.email }))) await Candidate.create(c);
  console.log('✅ Sample candidates created');

  // ----- sample accounts
  const accountsData = [
    { name: 'TechCorp Inc', industry: 'Technology', owner: 'Admin User', notes: 'Large enterprise client with multiple hiring needs' },
    { name: 'StartupXYZ',   industry: 'FinTech',    owner: 'Admin User', notes: 'Growing startup, rapid hiring' },
  ];
  for (const a of accountsData) if (!(await Account.findOne({ name: a.name }))) await Account.create(a);
  console.log('✅ Sample accounts created');

  // ----- sample applications (Alice -> Senior Software Engineer)
  const job = await Job.findOne({ title: 'Senior Software Engineer' });
  const candidate = await Candidate.findOne({ email: 'alice@example.com' });
  if (job && candidate) {
    const exists = await Application.findOne({ candidateId: candidate._id, jobId: job._id });
    if (!exists) {
      await Application.create({
        candidateId: candidate._id,
        jobId: job._id,
        stage: 'Interview',
        notes: 'Strong technical background, good culture fit',
        stageHistory: [
          { from: 'New', to: 'Screening', at: new Date(Date.now() - 5*24*60*60*1000), notes: 'Initial screening passed' },
          { from: 'Screening', to: 'Interview', at: new Date(Date.now() - 2*24*60*60*1000), notes: 'Scheduled technical interview' },
        ],
      });
    }
  }
  console.log('✅ Sample applications created');

  // ----- sample opportunity
  const account = await Account.findOne({ name: 'TechCorp Inc' });
  if (account && !(await Opportunity.findOne({ accountId: account._id }))) {
    await Opportunity.create({ accountId: account._id, title: 'Q1 Engineering Team Expansion', stage: 'Qualified', value: 250000, probability: 75 });
  }
  console.log('✅ Sample opportunities created');

  console.log('\n🎉 Seed complete. Demo logins: admin@company.com, recruiter@company.com, sales@company.com');
  console.log(`🔑 Password for all: ${DEMO_PASSWORD}\n`);
  process.exit(0);
}

seed().catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); });
