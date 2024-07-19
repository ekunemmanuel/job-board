// const companies = useCompanies();
// const data = companies.value.find((company) => {
//   return company.id === id;
// });

// const jobs = useJobs()

// const j = jobs.value.find((job) => {

// })
const job: Job = {
  companyName: "'PdUIof6kaj6ANQSlYPiU'",
  id: "PdUIof6kaj6ANQSlYPiU",
  title: "Software Engineer",
  location: {
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
  },
  type: "Full-time",
  createdAt: "",
  remote: "Hybrid",
  companyID: "",
  contact: {
    email: "",
    name: "",
    social: "",
  },
  description: "",
  salary: {
    amount: "2000",
    frequency: "Monthly",
  },
};

     <!-- <div>
          <ul class="space-y-4">
            <li v-for="(j, index) in jobs" :key="index">
              <JobCard :job="j" />
            </li>
          </ul>
        </div> -->


// const jobs = ref<Job[]>([]);

// try {
//   const { data } = await getCollection<Job>({
//     collectionName: "jobs",
//     ssrKey: "jobs",
//     order: [
//       {
//         field: "createdAt",
//         direction: "desc",
//       },
//     ],
//   });

//   jobs.value = await Promise.all(
//     data.value.map(async (job) => {
//       const companyDoc = await getDoc<Company>("companies", job.companyID);
//       return {
//         ...job,
//         id: job.id,
//         companyName: companyDoc.data.name,
//       };
//     })
//   );

//   // can you fix this for me so it will return the data not promise
// } catch (error) {
//   console.log(error);
// }