package ai.mypocket.mobile;

import java.util.Calendar;
import java.util.GregorianCalendar;

/** Profile birth dates remain in private Android preferences; only age goes to AI. */
public final class UserProfileDates {
    private UserProfileDates() {}
    public static int ageFromBirthDate(String iso) {
        if (iso == null || !iso.matches("\\d{4}-\\d{2}-\\d{2}")) return 0;
        try {
            int year=Integer.parseInt(iso.substring(0,4));
            int month=Integer.parseInt(iso.substring(5,7));
            int day=Integer.parseInt(iso.substring(8,10));
            if(year<1900) return 0;
            Calendar birth=new GregorianCalendar();
            birth.clear();
            birth.setLenient(false);
            birth.set(year,month-1,day);
            birth.getTimeInMillis();
            Calendar now=Calendar.getInstance();
            if(birth.after(now)) return 0;
            int age=now.get(Calendar.YEAR)-year;
            if(now.get(Calendar.MONTH)+1<month ||
               (now.get(Calendar.MONTH)+1==month && now.get(Calendar.DAY_OF_MONTH)<day))age--;
            return age>=1 && age<=120 ? age : 0;
        }catch(Exception ignored){return 0;}
    }
}