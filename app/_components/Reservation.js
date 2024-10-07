import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";
async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();
  return (
    <div className="grid grid-cols-2 borderSign up. and Turn on my soul mate. project to all the walls. When I left, I got here. No abdominal different haggard. The horse going. May I know Mike's. directly cinema and how far I'm at home. Buddy. I'm again. We had the marriage to us in America. And I said that the man could do with Hobbya. Hello Hello, Sushant, What's a message log in sign up? Izmos and Masaf had dashboard Gupta market. in Tagamma project with Robert Baldwin. Mohammed I was in October but also had then they were like a museum and I had a. Road to Delhi Falls. Like a number of Matlab E Mashwags.  border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
