import { Opportunity } from "./generated/prisma";

export interface JobCardProps {
    job: Opportunity;
    setJobs: React.Dispatch<React.SetStateAction<Opportunity[]>>;
}
    