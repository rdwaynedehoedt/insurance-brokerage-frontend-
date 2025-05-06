export default function RecentActivity() {
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
      <ul className="divide-y divide-gray-100">
        <li className="py-3 flex justify-between items-center">
          <span className="text-gray-700">Sold policy to <span className="font-semibold">Jane Doe</span></span>
          <span className="text-xs text-gray-500">Today, 10:15 AM</span>
        </li>
        <li className="py-3 flex justify-between items-center">
          <span className="text-gray-700">Followed up with <span className="font-semibold">Acme Corp</span></span>
          <span className="text-xs text-gray-500">Yesterday, 3:40 PM</span>
        </li>
        <li className="py-3 flex justify-between items-center">
          <span className="text-gray-700">Added new lead <span className="font-semibold">John Smith</span></span>
          <span className="text-xs text-gray-500">Yesterday, 1:22 PM</span>
        </li>
        <li className="py-3 flex justify-between items-center">
          <span className="text-gray-700">Sent policy renewal reminder to <span className="font-semibold">Mary Lee</span></span>
          <span className="text-xs text-gray-500">2 days ago</span>
        </li>
      </ul>
    </section>
  );
} 