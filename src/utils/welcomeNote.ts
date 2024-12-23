import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useSettingsStore } from '../store/settingsStore';

export async function getWelcomeNote() {
  const { settings } = useSettingsStore.getState();
  const timeOfDay = getTimeOfDay();

  if (settings.welcomeNoteStyle === 'simple') {
    return `Good ${timeOfDay}, ${settings.userName || 'User'}! Succeed on your Mission today!\n${format(new Date(), 'EEEE, MMMM d, yyyy')}`;
  }

  try {
    // Use a simpler query to avoid PGRST100 error
    const { data, error } = await supabase
      .from('welcome_notes')
      .select('*')
      .eq('category', settings.welcomeNoteStyle);

    if (error) throw error;
    if (!data || data.length === 0) return getSimpleWelcome();

    // Get a random note from the returned data
    const note = data[Math.floor(Math.random() * data.length)];

    if (settings.welcomeNoteStyle === 'biblical') {
      return `Remember: "${note.content}" - ${note.author}`;
    } else {
      return `Good ${timeOfDay}, ${settings.userName || 'User'}!\n"${note.content}" - ${note.author}`;
    }
  } catch (err) {
    console.error('Error fetching welcome note:', err);
    return getSimpleWelcome();
  }
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function getSimpleWelcome() {
  const { settings } = useSettingsStore.getState();
  return `Good ${getTimeOfDay()}, ${settings.userName || 'User'}! Succeed on your Mission today!\n${format(new Date(), 'EEEE, MMMM d, yyyy')}`;
}