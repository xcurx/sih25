import { Opportunity } from "./types";

export interface JobCardProps {
    job: Opportunity;
    setJobs: React.Dispatch<React.SetStateAction<Opportunity[]>>;
}
    