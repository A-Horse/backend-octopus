import bcrypt from 'bcryptjs';


function main() {
  if (!process.argv[2]) {
    return console.warning('Please input raw password.');
  }

  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(process.argv[2], salt, (error, hash) => {
      
    })
  });
}

