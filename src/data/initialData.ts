import { Contact, Goal, Event, Achievement, Resource } from '../types';

export const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    email: 'sarah.chen@google.com',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    priority: 90,
    lastContact: '2 days ago',
    tags: ['AI/ML', 'Alumni', 'Recruiter Contact'],
    status: 'active',
    avatar: '👩‍💻',
    notes: 'Met at Columbia alumni event. Very helpful with ML career advice. Mentioned Google is hiring for new grad positions.',
    addedDate: '2024-12-15',
    industry: 'Technology',
    expertise: ['Machine Learning', 'Python', 'TensorFlow']
  },
  {
    id: '2',
    name: 'Raj Patel',
    company: 'Microsoft',
    role: 'Principal Engineer',
    location: 'Seattle, WA',
    email: 'raj.patel@microsoft.com',
    priority: 85,
    lastContact: '1 week ago',
    tags: ['Cloud', 'Indian Network', 'Senior'],
    status: 'active',
    avatar: '👨‍💻',
    notes: 'Connected through Indian professional network. Works on Azure cloud services. Offered to refer for internships.',
    addedDate: '2024-12-10',
    industry: 'Technology',
    expertise: ['Cloud Computing', 'Azure', 'Distributed Systems']
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Amazon',
    role: 'Product Manager',
    location: 'New York, NY',
    email: 'emily.rodriguez@amazon.com',
    priority: 75,
    lastContact: '3 weeks ago',
    tags: ['Product', 'NYC', 'Startup Background'],
    status: 'needs_followup',
    avatar: '👩‍💼',
    notes: 'Former startup founder, now PM at Amazon. Great insights on product strategy. Need to follow up on coffee chat.',
    addedDate: '2024-11-28',
    industry: 'Technology',
    expertise: ['Product Management', 'Strategy', 'Leadership']
  }
];

export const initialGoals: Goal[] = [
  {
    id: '1',
    text: 'Send LinkedIn message to Sarah Chen (Google recruiter)',
    completed: true,
    icon: 'MessageSquare',
    priority: 'high',
    category: 'outreach',
    dueDate: '2025-01-15',
    createdDate: '2025-01-15'
  },
  {
    id: '2',
    text: 'Schedule coffee chat with Alumni network contact',
    completed: false,
    icon: 'Coffee',
    priority: 'medium',
    category: 'meeting',
    dueDate: '2025-01-16',
    createdDate: '2025-01-15'
  },
  {
    id: '3',
    text: 'Follow up with Microsoft connection from last week',
    completed: false,
    icon: 'Phone',
    priority: 'high',
    category: 'follow-up',
    dueDate: '2025-01-15',
    createdDate: '2025-01-15'
  }
];

export const initialEvents: Event[] = [
  {
    id: '1',
    date: new Date(2025, 0, 16),
    time: '2:00 PM',
    title: 'Coffee Chat with Sarah Chen',
    type: 'meetup',
    location: 'Starbucks, Times Square',
    priority: 'high',
    contactId: '1',
    description: 'Discuss ML career opportunities at Google',
    completed: false
  },
  {
    id: '2',
    date: new Date(2025, 0, 17),
    time: '10:00 AM',
    title: 'LinkedIn call with Raj Patel',
    type: 'call',
    location: 'Virtual',
    priority: 'medium',
    contactId: '2',
    description: 'Follow up on Azure internship opportunities',
    completed: false
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Add your first contact to the network',
    earned: true,
    icon: '🚀',
    earnedDate: '2024-12-01',
    category: 'milestone',
    requirement: 1,
    progress: 1,
    points: 10
  },
  {
    id: '2',
    title: 'Building Network',
    description: 'Add 10 contacts to your network',
    earned: false,
    icon: '🌱',
    category: 'milestone',
    requirement: 10,
    progress: 3,
    points: 50
  },
  {
    id: '3',
    title: 'Network Builder',
    description: 'Add 50 contacts to your network',
    earned: false,
    icon: '🏗️',
    category: 'milestone',
    requirement: 50,
    progress: 3,
    points: 200
  },
  {
    id: '4',
    title: 'Master Networker',
    description: 'Add 100 contacts to your network',
    earned: false,
    icon: '👑',
    category: 'milestone',
    requirement: 100,
    progress: 3,
    points: 500
  },
  {
    id: '5',
    title: 'Week Warrior',
    description: 'Maintained 7-day networking streak',
    earned: false,
    icon: '🔥',
    category: 'streak',
    requirement: 7,
    progress: 1,
    points: 100
  },
  {
    id: '6',
    title: 'Monthly Master',
    description: 'Maintain a 30-day networking streak',
    earned: false,
    icon: '⭐',
    category: 'streak',
    requirement: 30,
    progress: 1,
    points: 500
  },
  {
    id: '7',
    title: 'Century Club',
    description: 'Maintain a 100-day networking streak',
    earned: false,
    icon: '💎',
    category: 'streak',
    requirement: 100,
    progress: 1,
    points: 2000
  },
  {
    id: '8',
    title: 'Ice Breaker',
    description: 'Log your first interaction',
    earned: true,
    icon: '🧊',
    earnedDate: '2024-12-01',
    category: 'engagement',
    requirement: 1,
    progress: 1,
    points: 10
  },
  {
    id: '9',
    title: 'Conversation Master',
    description: 'Use 20 conversation templates',
    earned: false,
    icon: '💬',
    category: 'engagement',
    requirement: 20,
    progress: 0,
    points: 100
  },
  {
    id: '10',
    title: 'Cold Outreach Pro',
    description: 'Successfully connect with 5 unknown experts',
    earned: false,
    icon: '🎯',
    category: 'growth',
    requirement: 5,
    progress: 0,
    points: 300
  },
  {
    id: '11',
    title: 'Weekend Warrior',
    description: 'Complete 10 weekend networking activities',
    earned: false,
    icon: '🏃',
    category: 'special',
    requirement: 10,
    progress: 0,
    points: 150
  },
  {
    id: '12',
    title: 'Early Bird',
    description: 'Complete a networking event before 9 AM',
    earned: false,
    icon: '🌅',
    category: 'special',
    requirement: 1,
    progress: 0,
    points: 50
  },
  {
    id: '13',
    title: 'Coffee Champion',
    description: 'Scheduled 10 coffee chats',
    earned: false,
    icon: '☕',
    category: 'meetings',
    requirement: 10,
    progress: 3,
    points: 150
  }
];

export const conversationTemplates: ConversationTemplate[] = [
  {
    id: '1',
    title: 'Cold LinkedIn Outreach',
    category: 'cold_outreach',
    scenario: 'Reaching out to someone you don\'t know on LinkedIn',
    template: `Hi [Name],

I hope this message finds you well. I'm [Your Name], a Computer Science graduate student at [University] with a keen interest in [specific area/technology they work with].

I came across your profile and was impressed by your work at [Company], particularly [specific project/achievement]. As someone aspiring to work in [industry/role], I would greatly value the opportunity to learn from your experience.

Would you be open to a brief 15-20 minute coffee chat or virtual call? I'd love to hear about your journey and any advice you might have for someone starting their career in tech.

Thank you for your time, and I look forward to hearing from you.

Best regards,
[Your Name]`,
    tips: [
      'Personalize the message with specific details about their work',
      'Keep it concise and respectful of their time',
      'Mention your university and background briefly',
      'Be specific about what you want (advice, not a job)',
      'Always include a clear call-to-action'
    ]
  },
  {
    id: '2',
    title: 'Alumni Network Outreach',
    category: 'cold_outreach',
    scenario: 'Connecting with alumni from your university',
    template: `Hi [Name],

I hope you're doing well! I'm [Your Name], a current [degree] student at [University], and I noticed we're both [University] alumni.

I'm particularly interested in [their field/company] and would love to learn more about your experience transitioning from [University] to [Company/Industry]. As a fellow [University mascot/alumni], I was hoping you might be willing to share some insights about your career journey.

Would you be available for a brief coffee chat or phone call in the coming weeks? I'd be happy to work around your schedule.

Go [University mascot]!

Best,
[Your Name]`,
    tips: [
      'Leverage the shared university connection',
      'Use school-specific language and references',
      'Mention your current status at the university',
      'Be respectful of the alumni bond',
      'Include school spirit elements'
    ]
  },
  {
    id: '3',
    title: 'Follow-up After Meeting',
    category: 'follow_up',
    scenario: 'Following up after meeting someone at an event or coffee chat',
    template: `Hi [Name],

Thank you so much for taking the time to meet with me [yesterday/last week]. I really enjoyed our conversation about [specific topic discussed] and found your insights about [specific advice/information] particularly valuable.

As you suggested, I've [specific action they recommended]. I'd love to keep you updated on my progress and would welcome any additional thoughts you might have.

[Optional: Attach something of value - article, resource, connection]

Thank you again for your time and guidance. I hope we can stay in touch!

Best regards,
[Your Name]`,
    tips: [
      'Send within 24-48 hours of meeting',
      'Reference specific parts of your conversation',
      'Show that you took action on their advice',
      'Offer something of value in return',
      'Keep the door open for future communication'
    ]
  },
  {
    id: '4',
    title: 'Coffee Chat Request',
    category: 'coffee_chat',
    scenario: 'Requesting an informal coffee meeting',
    template: `Hi [Name],

I hope you're having a great week! I've been following your work at [Company] and am really impressed by [specific achievement/project].

I'm currently [your situation - student, job searching, etc.] and would love to learn more about your experience in [their field/role]. Would you be interested in grabbing coffee sometime in the next few weeks? I'd love to hear about your career journey and any advice you might have.

I'm happy to meet wherever is most convenient for you, or we could do a virtual coffee chat if that works better.

Looking forward to hearing from you!

Best,
[Your Name]`,
    tips: [
      'Suggest a low-commitment meeting',
      'Be flexible with location and format',
      'Show genuine interest in their work',
      'Keep the request casual and friendly',
      'Offer virtual options for convenience'
    ]
  },
  {
    id: '5',
    title: 'Thank You After Help',
    category: 'thank_you',
    scenario: 'Thanking someone who provided assistance or advice',
    template: `Hi [Name],

I wanted to reach out and thank you for [specific help they provided]. Your [advice/introduction/recommendation] has been incredibly helpful, and I'm excited to share that [positive outcome/progress made].

[Specific example of how their help made a difference]

I truly appreciate you taking the time to help me, and I hope I can pay it forward someday. Please let me know if there's ever anything I can do to help you in return.

With gratitude,
[Your Name]`,
    tips: [
      'Be specific about what they did to help',
      'Share the positive outcome of their assistance',
      'Express genuine gratitude',
      'Offer to help them in return',
      'Keep it concise but heartfelt'
    ]
  },
  {
    id: '6',
    title: 'Referral Request',
    category: 'referral_request',
    scenario: 'Asking for a referral to a job or opportunity',
    template: `Hi [Name],

I hope you're doing well! I wanted to reach out because I noticed that [Company] has an opening for [specific role] that aligns perfectly with my background and interests.

Given your experience at [Company] and our previous conversations about [relevant topic], I was wondering if you'd be comfortable providing a referral or introduction. I've attached my resume for your review.

[Brief summary of your qualifications and why you're interested]

I completely understand if you're not able to provide a referral, and I appreciate any guidance you might have about the application process.

Thank you for considering this, and I hope to hear from you soon.

Best regards,
[Your Name]`,
    tips: [
      'Only ask people you have a genuine relationship with',
      'Be specific about the role and company',
      'Attach your resume for easy reference',
      'Give them an easy way to say no',
      'Express appreciation regardless of their response'
    ]
  },
  {
    id: '7',
    title: 'Introduction Request',
    category: 'introduction',
    scenario: 'Asking for an introduction to someone in their network',
    template: `Hi [Name],

I hope you're having a great week! I was wondering if you might be able to help me with an introduction.

I'm very interested in learning more about [specific area/company/role], and I noticed that you're connected with [Person's name] at [Company]. Based on their background in [relevant area], I think they would be a great person to speak with about [specific topic/advice you're seeking].

Would you be comfortable making an introduction? I've drafted a brief note below that you could forward if that would be helpful:

[Draft introduction message]

Thank you for considering this, and please let me know if you need any additional information.

Best,
[Your Name]`,
    tips: [
      'Make the introduction easy for them',
      'Provide a draft message they can forward',
      'Be specific about why you want to connect',
      'Show that you\'ve done your research',
      'Give them an easy way to decline'
    ]
  }
];

export const mockExpertProfiles: ExpertProfile[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Distributed Systems'],
    industry: 'Technology',
    experience: '8+ years',
    linkedinUrl: 'https://linkedin.com/in/alexchen',
    recentActivity: 'Posted about AI ethics in tech',
    mutualConnections: 3,
    connectionDifficulty: 'medium',
    avatar: '👨‍💻'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Principal Engineer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    skills: ['Cloud Computing', 'Azure', 'Kubernetes', 'DevOps'],
    industry: 'Technology',
    experience: '10+ years',
    linkedinUrl: 'https://linkedin.com/in/priyasharma',
    recentActivity: 'Shared insights on cloud architecture',
    mutualConnections: 1,
    connectionDifficulty: 'hard',
    avatar: '👩‍💻'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    role: 'Product Manager',
    company: 'Meta',
    location: 'Menlo Park, CA',
    skills: ['Product Strategy', 'Data Analysis', 'User Research', 'Agile'],
    industry: 'Technology',
    experience: '6+ years',
    linkedinUrl: 'https://linkedin.com/in/davidrodriguez',
    recentActivity: 'Wrote about product-market fit',
    mutualConnections: 5,
    connectionDifficulty: 'easy',
    avatar: '👨‍💼'
  },
  {
    id: '4',
    name: 'Sarah Kim',
    role: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    skills: ['Data Science', 'Machine Learning', 'Python', 'SQL', 'Statistics'],
    industry: 'Technology',
    experience: '5+ years',
    linkedinUrl: 'https://linkedin.com/in/sarahkim',
    recentActivity: 'Published research on recommendation systems',
    mutualConnections: 2,
    connectionDifficulty: 'medium',
    avatar: '👩‍🔬'
  },
  {
    id: '5',
    name: 'Michael Johnson',
    role: 'Engineering Manager',
    company: 'Amazon',
    location: 'Seattle, WA',
    skills: ['Team Leadership', 'System Design', 'AWS', 'Microservices'],
    industry: 'Technology',
    experience: '12+ years',
    linkedinUrl: 'https://linkedin.com/in/michaeljohnson',
    recentActivity: 'Shared tips on engineering leadership',
    mutualConnections: 0,
    connectionDifficulty: 'hard',
    avatar: '👨‍💼'
  }
];
export const initialResources: Resource[] = [
  {
    id: '1',
    title: 'The Art of Professional Networking',
    type: 'article',
    readTime: '8 min',
    category: 'Networking Fundamentals',
    content: `# The Art of Professional Networking

## Introduction
Professional networking is one of the most crucial skills for career success, especially in the competitive tech industry. This comprehensive guide will teach you the fundamentals of building meaningful professional relationships.

## Key Principles

### 1. Give Before You Receive
The most successful networkers understand that networking is about building mutually beneficial relationships. Always look for ways to help others before asking for favors.

### 2. Quality Over Quantity
It's better to have 50 meaningful connections than 500 superficial ones. Focus on building deep, authentic relationships.

### 3. Be Genuine
People can sense authenticity. Be yourself and show genuine interest in others' work and achievements.

## Networking Strategies

### Online Networking
- Optimize your LinkedIn profile
- Engage meaningfully with others' posts
- Share valuable content regularly
- Join industry-specific groups

### In-Person Networking
- Attend industry meetups and conferences
- Join professional organizations
- Participate in alumni events
- Volunteer for causes you care about

## Follow-Up Best Practices
- Send a personalized message within 24 hours
- Reference specific topics from your conversation
- Offer value or assistance
- Suggest a concrete next step

## Common Mistakes to Avoid
- Being too transactional
- Only reaching out when you need something
- Failing to follow up
- Not maintaining existing relationships

## Conclusion
Networking is a long-term investment in your career. Start early, be consistent, and always focus on building genuine relationships.`
  },
  {
    id: '2',
    title: 'Coffee Chat Conversation Starters',
    type: 'guide',
    readTime: '5 min',
    category: 'Networking Fundamentals',
    content: `# Coffee Chat Conversation Starters

## Before the Meeting
Research your contact's background, recent projects, and company news. This shows respect and genuine interest.

## Opening Questions
- "How did you get started in [their field/company]?"
- "What's the most exciting project you're working on right now?"
- "How has your role evolved since you started at [company]?"

## Career Journey Questions
- "What advice would you give to someone starting their career in tech?"
- "What skills do you think are most important for success in your role?"
- "How do you stay updated with industry trends?"

## Company Culture Questions
- "What do you enjoy most about working at [company]?"
- "How would you describe the company culture?"
- "What opportunities for growth and learning does the company provide?"

## Industry Insights
- "What trends do you see shaping the industry?"
- "What challenges is your industry facing right now?"
- "Where do you see the field heading in the next few years?"

## Closing Questions
- "Is there anyone else you'd recommend I speak with?"
- "What resources would you suggest for someone in my position?"
- "How can I be helpful to you or your team?"

## Remember
- Listen more than you speak
- Take notes (with permission)
- Be respectful of their time
- Always follow up with a thank you message`
  },
  {
    id: '3',
    title: 'Networking as an International Student in US',
    type: 'guide',
    readTime: '20 min',
    category: 'International Students',
    featured: true,
    content: `# Networking as an International Student in the US

## Understanding the American Professional Culture

### Key Cultural Differences
- Americans value direct communication and confidence
- Small talk is important for building rapport
- Professional relationships often extend beyond work
- Self-promotion is expected and respected

### Building Your Personal Brand
- Develop a clear elevator pitch
- Highlight your unique international perspective
- Emphasize your adaptability and global mindset
- Showcase technical skills and academic achievements

## Leveraging Your International Background

### Your Unique Value Proposition
- Multilingual abilities
- Cross-cultural communication skills
- Global perspective on technology and business
- Diverse problem-solving approaches

### Common Challenges and Solutions
**Challenge**: Feeling intimidated by native speakers
**Solution**: Practice your elevator pitch, prepare conversation topics, and remember that your perspective is valuable

**Challenge**: Understanding workplace culture
**Solution**: Observe, ask questions, and find mentors who can guide you

**Challenge**: Building trust quickly
**Solution**: Be reliable, follow through on commitments, and show genuine interest in others

## Networking Strategies for International Students

### On-Campus Opportunities
- Join student organizations related to your field
- Attend career fairs and networking events
- Connect with professors and teaching assistants
- Participate in research projects and competitions

### Professional Organizations
- IEEE (for engineering students)
- ACM (for computer science students)
- Local tech meetups and user groups
- Industry-specific associations

### Online Networking
- Optimize your LinkedIn profile with US-focused keywords
- Join LinkedIn groups for international professionals
- Follow and engage with industry leaders
- Share content that showcases your expertise

## Overcoming Common Obstacles

### Language and Communication
- Practice speaking clearly and confidently
- Learn industry-specific terminology
- Don't apologize for your accent - it's part of your unique identity
- Ask for clarification when needed

### Cultural Navigation
- Observe how Americans network at events
- Learn the art of small talk
- Understand the importance of follow-up
- Be prepared to talk about your achievements

### Building Credibility
- Highlight your academic achievements
- Showcase relevant projects and internships
- Get involved in the local tech community
- Seek recommendations from professors and supervisors

## Practical Tips for Success

### Before Networking Events
- Research attendees and speakers
- Prepare your elevator pitch
- Set specific goals for the event
- Bring business cards or have a digital contact method ready

### During Events
- Arrive early to meet people in a less crowded environment
- Ask open-ended questions
- Listen actively and show genuine interest
- Exchange contact information with promising connections

### After Events
- Follow up within 24-48 hours
- Reference specific topics from your conversation
- Offer value or assistance
- Suggest a concrete next step (coffee chat, informational interview)

## Long-term Relationship Building

### Maintaining Connections
- Regular check-ins (quarterly or bi-annually)
- Share relevant articles or opportunities
- Congratulate on promotions and achievements
- Offer help when possible

### Giving Back
- Mentor newer international students
- Share your experiences and insights
- Volunteer for organizations that helped you
- Become a bridge between cultures in your workplace

## Success Stories

Many international students have successfully built strong professional networks in the US. The key is to start early, be consistent, and always focus on building genuine relationships rather than just collecting contacts.

Remember: Your international background is an asset, not a liability. Embrace it, leverage it, and use it to stand out in the competitive US job market.`
  }
];