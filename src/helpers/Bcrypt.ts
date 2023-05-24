const bcrypt = require('bcrypt');
// import config from "../config/index";


class bcryptHelper {

 generateHash = async(password)=> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Function to compare a password with a hash
 comparePassword= async(password, hash)=> {
  const match = await bcrypt.compare(password, hash);
  return match;
}




}

export default new bcryptHelper();
