import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: string,
  agingProfile: string,
  barcode: string,
  barcodeImage: string,
  cases: string,
  date: string,
  description: string,
  expiration_date: string,
  item: string,
  lastModifiedBy: string,
  quantity: number,
  status: string,
}

interface RecentActivityProps {
  loaded: number,
  setLoaded: (value: number) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ loaded, setLoaded }) => {
  const { toast } = useToast();
  const [activity, setActivity] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchRecentActivity = async() => {
      try {
        const db = getDatabase();
        const inventoryRef = ref(db, 'inventory');
        const recentActivityQuery = query(
          inventoryRef, 
          orderByChild("lastModifierBy"),
          limitToLast(5)
        );

        const snapshot = await get(recentActivityQuery);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const activityData = Object.entries(data).map(([id, item]) => ({
            id, 
            ...item,
          })) as InventoryItem[];

          // Sort the data by `lastModifiedBy` in ascending order
          const sortedActivity = activityData.sort((a, b) =>
            a.lastModifiedBy.localeCompare(b.lastModifiedBy)
          );

          setActivity(sortedActivity);
          setLoaded(loaded + 1);
        } else {
          console.error("No recent activity found");
          toast({
            title: 'Error',
            description: 'No recent activity found',
            variant: 'destructive'
          })
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error fetching recent activity',
          variant: 'destructive'
        })
        console.log('Error fetching recent activity: ', error);
      }
    };

    fetchRecentActivity();
  }), [loaded, setLoaded];

  return (
    <div className='bg-white rounded-lg p-4 shadow-md'>
      <div className='recent-activity'>
        <h2 className='text-lg font-semibold'> Recent activity </h2>
        <div className='console'>
          {activity.map((item) => (
            <div key={item.id} className='console-line'>
              <span className='console-timestamp'>
                {new Date(item.date).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentActivity;