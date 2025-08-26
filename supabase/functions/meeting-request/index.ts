import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingRequestData {
  name: string;
  email: string;
  company?: string;
  meeting_type: string;
  proposed_date: string;
  duration: number;
  agenda?: string;
  message?: string;
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

    const meetingData: MeetingRequestData = await req.json();
    console.log("Received meeting request:", meetingData);

    // Insert meeting request into database
    const { data: meeting, error: insertError } = await supabase
      .from("meeting_requests")
      .insert({
        name: meetingData.name,
        email: meetingData.email,
        company: meetingData.company,
        meeting_type: meetingData.meeting_type,
        proposed_date: meetingData.proposed_date,
        duration: meetingData.duration,
        agenda: meetingData.agenda,
        message: meetingData.message,
        status: "pending"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Format the date for display
    const proposedDate = new Date(meetingData.proposed_date);
    const formattedDate = proposedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Portfolio Meetings <noreply@resend.dev>",
      to: [meetingData.email],
      subject: "Meeting Request Received - Pending Approval",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Meeting Request Received</h2>
          <p>Hi ${meetingData.name},</p>
          <p>Thank you for requesting a meeting! I've received your request with the following details:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Meeting Type:</strong> ${meetingData.meeting_type}<br>
            <strong>Proposed Date:</strong> ${formattedDate}<br>
            <strong>Duration:</strong> ${meetingData.duration} minutes<br>
            <strong>Agenda:</strong> ${meetingData.agenda || 'Not specified'}
          </div>
          <p><strong>Status:</strong> Pending Approval</p>
          <p>I'll review your request and get back to you within 24 hours with either:</p>
          <ul>
            <li>✅ Confirmation with meeting link and calendar invite</li>
            <li>📅 Alternative time slots if the requested time isn't available</li>
          </ul>
          <p>You'll receive an automatic notification once I've reviewed your request.</p>
          <p>Looking forward to our conversation!</p>
          <p>Best regards,<br>Your Portfolio Team</p>
        </div>
      `,
    });

    // Send notification email to portfolio owner
    const adminEmailResponse = await resend.emails.send({
      from: "Portfolio Meetings <noreply@resend.dev>",
      to: ["your-email@example.com"], // Replace with your actual email
      subject: `New Meeting Request from ${meetingData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Meeting Request</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Name:</strong> ${meetingData.name}<br>
            <strong>Email:</strong> ${meetingData.email}<br>
            <strong>Company:</strong> ${meetingData.company || 'Not provided'}<br>
            <strong>Meeting Type:</strong> ${meetingData.meeting_type}<br>
            <strong>Proposed Date:</strong> ${formattedDate}<br>
            <strong>Duration:</strong> ${meetingData.duration} minutes<br>
            <strong>Agenda:</strong> ${meetingData.agenda || 'Not specified'}
          </div>
          <h4>Message:</h4>
          <p style="background: #fff; padding: 15px; border-left: 4px solid #007cba;">
            ${meetingData.message || 'No message provided'}
          </p>
          <p><strong>Meeting ID:</strong> ${meeting.id}</p>
          <div style="margin: 20px 0;">
            <p><strong>Action Required:</strong> Please approve or reject this meeting request.</p>
            <p><em>You can use the meeting management system to respond to this request.</em></p>
          </div>
        </div>
      `,
    });

    // Log notifications
    await supabase.from("notifications").insert([
      {
        recipient_email: meetingData.email,
        type: "meeting_request",
        subject: "Meeting Request Received - Pending Approval",
        content: "Meeting request confirmation sent to client",
        related_meeting_id: meeting.id
      }
    ]);

    console.log("Client email sent:", clientEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        meetingId: meeting.id,
        message: "Meeting request received and confirmations sent"
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
    console.error("Error in meeting-request function:", error);
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