import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingManagementData {
  meetingId: string;
  action: 'approve' | 'reject';
  adminNotes?: string;
  meetingLink?: string;
  alternativeDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { meetingId, action, adminNotes, meetingLink, alternativeDate }: MeetingManagementData = await req.json();
    console.log("Managing meeting:", { meetingId, action });

    // Get the meeting request
    const { data: meeting, error: fetchError } = await supabase
      .from("meeting_requests")
      .select("*")
      .eq("id", meetingId)
      .single();

    if (fetchError || !meeting) {
      throw new Error("Meeting request not found");
    }

    // Update meeting status
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      admin_notes: adminNotes,
      approved_date: action === 'approve' ? new Date().toISOString() : null,
    };

    if (action === 'approve' && meetingLink) {
      updateData.meeting_link = meetingLink;
    }

    const { error: updateError } = await supabase
      .from("meeting_requests")
      .update(updateData)
      .eq("id", meetingId);

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    // Format the date for display
    const proposedDate = new Date(meeting.proposed_date);
    const formattedDate = proposedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    let emailSubject: string;
    let emailContent: string;
    let notificationType: string;

    if (action === 'approve') {
      emailSubject = "✅ Meeting Approved - Let's Connect!";
      notificationType = "meeting_approved";
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Meeting Approved!</h2>
          <p>Hi ${meeting.name},</p>
          <p>Great news! Your meeting request has been approved. Here are the confirmed details:</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; border-left: 4px solid #22c55e; margin: 15px 0;">
            <strong>Meeting Type:</strong> ${meeting.meeting_type}<br>
            <strong>Date & Time:</strong> ${formattedDate}<br>
            <strong>Duration:</strong> ${meeting.duration} minutes<br>
            <strong>Agenda:</strong> ${meeting.agenda || 'Open discussion'}
          </div>
          ${meetingLink ? `
            <div style="background: #22c55e; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0;">Join the Meeting</h3>
              <a href="${meetingLink}" style="color: white; font-size: 18px; text-decoration: none; font-weight: bold;">${meetingLink}</a>
            </div>
          ` : ''}
          ${adminNotes ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <strong>Additional Notes:</strong><br>
              ${adminNotes}
            </div>
          ` : ''}
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>📅 Calendar Reminder:</strong> Please add this meeting to your calendar to ensure you don't miss it.
          </div>
          <p>Looking forward to our conversation!</p>
          <p>Best regards,<br>Your Portfolio Team</p>
        </div>
      `;
    } else {
      emailSubject = "Meeting Request Update";
      notificationType = "meeting_rejected";
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Meeting Request Update</h2>
          <p>Hi ${meeting.name},</p>
          <p>Thank you for your meeting request. Unfortunately, I'm not available at the requested time:</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 5px; border-left: 4px solid #ef4444; margin: 15px 0;">
            <strong>Requested:</strong> ${formattedDate}<br>
            <strong>Duration:</strong> ${meeting.duration} minutes
          </div>
          ${alternativeDate ? `
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <strong>Alternative Suggestion:</strong><br>
              ${new Date(alternativeDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
          ` : ''}
          ${adminNotes ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <strong>Message:</strong><br>
              ${adminNotes}
            </div>
          ` : ''}
          <p>Please feel free to submit a new meeting request with alternative times, or reply to this email to coordinate scheduling.</p>
          <p>Thank you for your understanding!</p>
          <p>Best regards,<br>Your Portfolio Team</p>
        </div>
      `;
    }

    // Send notification email to client
    const emailResponse = await resend.emails.send({
      from: "Portfolio Meetings <noreply@resend.dev>",
      to: [meeting.email],
      subject: emailSubject,
      html: emailContent,
    });

    // Log notification
    await supabase.from("notifications").insert([
      {
        recipient_email: meeting.email,
        type: notificationType,
        subject: emailSubject,
        content: `Meeting ${action}d notification sent to client`,
        related_meeting_id: meetingId
      }
    ]);

    console.log("Notification email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Meeting ${action}d and notification sent to ${meeting.email}`
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in manage-meeting function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);