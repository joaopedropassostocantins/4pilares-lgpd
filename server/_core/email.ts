/**
 * Email service for sending analysis to users
 * Currently stores analysis in database; email sending can be added later
 */

export async function sendEmailWithAnalysis(
  email: string,
  name: string,
  analysis: string,
  analysisType: "tasting" | "full" = "full"
): Promise<boolean> {
  try {
    if (!email) {
      console.log("[Email] No email provided, skipping email send");
      return true; // Not an error, just no email to send to
    }

    // For now, just log that we would send an email
    // The analysis is already stored in the database and will be displayed on the page
    console.log(`[Email] Analysis ready for ${email} (${analysisType})`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}
