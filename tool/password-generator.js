import bcrypt from 'bcryptjs';


async function main() {
  const input = process.argv[2];
  if (!input) {
    return console.warn('Please input raw password.');
  }
  
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(input, salt, (error, hash) => {
      console.log(hash);
    })
  });
}

main();
