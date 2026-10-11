import NavBar from "@/components/NavBar";
import MeetingScheduler from "@/components/MeetingScheduler";

export default function MeetingPage() {
  return (
    <div>
      <NavBar />
      <main className="py-12">
        <MeetingScheduler />
      </main>
    </div>
  );
}
