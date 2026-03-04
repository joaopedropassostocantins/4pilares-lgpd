import { generateWelcomeEmail, generateUpsellEmail, generateReengagementEmail, sendEmail } from "./email";
import { getDiagnosticByPublicId } from "./db";

interface ScheduledEmail {
  diagnosticId: string;
  email: string;
  userName: string;
  type: "welcome" | "upsell" | "reengagement";
  scheduledFor: Date;
  sent: boolean;
}

// In-memory queue (replace with database in production)
const emailQueue: ScheduledEmail[] = [];

/**
 * Schedule Email 1 (Welcome) - Immediately
 */
export async function scheduleWelcomeEmail(diagnosticId: string, email: string, userName: string): Promise<void> {
  const welcomeEmail = generateWelcomeEmail(userName, diagnosticId);
  await sendEmail(email, welcomeEmail);
  
  console.log(`✅ Welcome email sent to ${email}`);
}

/**
 * Schedule Email 2 (Upsell) - 2 days later
 */
export async function scheduleUpsellEmail(diagnosticId: string, email: string, userName: string): Promise<void> {
  const scheduledFor = new Date();
  scheduledFor.setDate(scheduledFor.getDate() + 2); // 2 days from now
  
  emailQueue.push({
    diagnosticId,
    email,
    userName,
    type: "upsell",
    scheduledFor,
    sent: false,
  });
  
  console.log(`📅 Upsell email scheduled for ${email} on ${scheduledFor.toISOString()}`);
}

/**
 * Schedule Email 3 (Reengagement) - 7 days later if not purchased
 */
export async function scheduleReengagementEmail(diagnosticId: string, email: string, userName: string): Promise<void> {
  const scheduledFor = new Date();
  scheduledFor.setDate(scheduledFor.getDate() + 7); // 7 days from now
  
  emailQueue.push({
    diagnosticId,
    email,
    userName,
    type: "reengagement",
    scheduledFor,
    sent: false,
  });
  
  console.log(`📅 Reengagement email scheduled for ${email} on ${scheduledFor.toISOString()}`);
}

/**
 * Process scheduled emails (run periodically)
 * In production, use a job queue like Bull or Agenda
 */
export async function processScheduledEmails(): Promise<void> {
  const now = new Date();
  
  for (const scheduledEmail of emailQueue) {
    if (scheduledEmail.sent) continue;
    if (scheduledEmail.scheduledFor > now) continue;
    
    try {
      let template;
      
      if (scheduledEmail.type === "upsell") {
        template = generateUpsellEmail(scheduledEmail.userName, scheduledEmail.diagnosticId);
      } else if (scheduledEmail.type === "reengagement") {
        template = generateReengagementEmail(scheduledEmail.userName, scheduledEmail.diagnosticId);
      } else {
        continue;
      }
      
      const success = await sendEmail(scheduledEmail.email, template);
      
      if (success) {
        scheduledEmail.sent = true;
        console.log(`✅ ${scheduledEmail.type} email sent to ${scheduledEmail.email}`);
      }
    } catch (error) {
      console.error(`❌ Error processing scheduled email:`, error);
    }
  }
}

/**
 * Start email scheduler (run every 5 minutes)
 */
export function startEmailScheduler(): void {
  // Run every 5 minutes
  setInterval(() => {
    processScheduledEmails().catch(console.error);
  }, 5 * 60 * 1000);
  
  console.log("📧 Email scheduler started (runs every 5 minutes)");
}
