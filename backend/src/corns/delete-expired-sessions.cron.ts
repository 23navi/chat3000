import cron from 'node-cron';
import Session from '../models/session.model';

const deleteExpiredSession = () => {
  // Cron job to delete expired sessions where session.valid = false
  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        await Session.deleteMany({ valid: false });
        console.log('Expired sessions deleted successfully.');
      } catch (error) {
        console.error('Error deleting expired sessions:', error);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    },
  );
};

export default deleteExpiredSession;
