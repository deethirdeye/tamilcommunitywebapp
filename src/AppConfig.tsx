const AppConfig = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://tamilcommunityapi.thirdeyeinfotech.com/api'
        : 'https://tamilcommunityapi.thirdeyeinfotech.com/api'
       // : 'https://localhost:7088/api',
  };


  
  export default AppConfig;