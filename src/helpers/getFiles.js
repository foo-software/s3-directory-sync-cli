import fs from 'fs';
import readdir from 'recursive-readdir';

export default dirPath => {
  return fs.existsSync(dirPath) ? readdir(dirPath) : [];
};
