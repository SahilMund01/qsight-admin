import axios from "axios";


const fetchAdminData = async () => {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({ data: adminData });
  //   }, 1000); 
  // });

  try {
    const data = await axios.get("https://proj-qsight.techo.camp/api/tenant/all");
  console.log(data);
  return data;
  } catch (error) {
    console.error('ERROR', error)
  }
};
// const fetchUserData = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ data: tenatData });
//     }, 1000); 
//   });
// };

// Function to generate serial numbers for Screen 2 data
const addSerialNumbers = (data) => {
  return data.map((item, index) => ({
    srNo: index + 1,
    ...item,
  }));
};

// Fetch and process Screen 2 data
export const fetchAndProcessAdminData = async () => {
  try {
    const response = await fetchAdminData();
    const dataWithSerialNumbers = addSerialNumbers(response.data);
    return dataWithSerialNumbers;
  } catch (error) {
    console.error("Error fetching and processing Screen 2 data:", error);
  }
};

// export const fetchAndProcessUserData = async () => {
//     try {
//       const response = await fetchUserData();
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching and processing Screen 2 data:", error);
//     }
//   };

