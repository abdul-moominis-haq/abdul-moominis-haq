import ContactInquiry from './contactInquiry.js';
import MeetingRequest from './meetingRequest.js';
import Notification from './notification.js';

const AppModel = {
  // Submit a contact inquiry and create a notification entry
  async submitContact(data) {
    const inquiry = await ContactInquiry.create(data);
    await Notification.create({
      title: 'New contact inquiry',
      body: `New contact from ${inquiry.name} (${inquiry.email})`,
      recipient: 'owner',
      metadata: { inquiryId: inquiry.id }
    });
    return inquiry;
  },

  // Submit meeting request and notify
  async submitMeeting(data) {
    const meeting = await MeetingRequest.create(data);
    await Notification.create({
      title: 'New meeting request',
      body: `Meeting requested by ${meeting.name} (${meeting.email})`,
      recipient: 'owner',
      metadata: { meetingId: meeting.id }
    });
    return meeting;
  }
};

export default AppModel;
