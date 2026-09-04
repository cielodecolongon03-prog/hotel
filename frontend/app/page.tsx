export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Crown Jewel Hotel Management
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Task Management and Employee Rating System
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Task Management</h2>
            <p className="text-muted-foreground">
              Digital task assignment, monitoring, and verification
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Employee Performance</h2>
            <p className="text-muted-foreground">
              Standardized ratings and performance tracking
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Guest Feedback</h2>
            <p className="text-muted-foreground">
              Collect and analyze guest ratings and feedback
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
