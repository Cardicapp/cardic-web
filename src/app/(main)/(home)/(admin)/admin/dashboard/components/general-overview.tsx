import { DollarSign } from '@/app/(main)/(home)/_components/overview-cards/icons';
import { OverviewOne } from '@/app/(main)/(home)/_components/overview-cards/overview-one';
import { PeriodPicker } from '@/components/period-picker';
import React from 'react';
import styles from './index.module.css';
import { DashboardType, OverviewData } from '../page';

interface GeneralOverviewProps {
    overviewData: OverviewData;
    timeFrame?: string;
    overviewTitle?: string;
    children?: React.ReactNode;
}

export const GeneralOverview: React.FC<GeneralOverviewProps> = (props) => {
    const { overviewTitle = "Cardic", timeFrame, children } = props;
    return (
        <div className={`${styles.overviewContainer} rounded-lg border border-gray-200 bg-white p-6 shadow-sm`}>
            <div className="max-xl:hidden mb-6 flex items-center justify-between">
                <p className="font-medium">{overviewTitle} Overview</p>
                {
                    timeFrame && (
                        <PeriodPicker
                            items={["this week", "last week"]}
                            defaultValue={timeFrame || "this week"}
                            sectionKey="weeks_profit"
                        />)
                }

            </div>
            {children}
        </div>
    );
};