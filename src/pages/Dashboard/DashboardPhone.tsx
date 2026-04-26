import CallForwardingSetupModal from '@/components/dashboard/phone/CallForwardingSetupModal'
import CallSettings from '@/components/dashboard/phone/CallSettings'
import { useState } from 'react'

const DashboardPhone = () => {
    const [isCallForwardingSetupModalOpen, setIsCallForwardingSetupModalOpen] = useState(false);
    return (
        <div className='min-h-screen px-0 md:px-9 py-4 text-white bg-black'>
            <CallSettings />

            {isCallForwardingSetupModalOpen && (
                <CallForwardingSetupModal
                    isOpen={isCallForwardingSetupModalOpen}
                    setIsOpen={setIsCallForwardingSetupModalOpen}
                    id={1}
                />
            )}
        </div>
    )
}

export default DashboardPhone