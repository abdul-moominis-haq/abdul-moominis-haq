import AppModel from './appModel.js';

const MainModel = {
  // Initialize or wire up higher-level services here
  async init() {
    // placeholder for future initialization logic
    return true;
  },

  // Expose core flows
  submitContact: AppModel.submitContact,
  submitMeeting: AppModel.submitMeeting
};

export default MainModel;
