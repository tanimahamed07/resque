import ProfileCard from "@/components/profile/ProfileCard";

export default function DispatcherProfilePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your dispatcher profile
        </p>
      </div>

      <ProfileCard />
    </div>
  );
}
