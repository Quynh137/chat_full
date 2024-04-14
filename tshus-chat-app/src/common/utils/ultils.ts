import { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    // Reader Object
    const reader = new FileReader();

    // Read data from url
    reader.readAsDataURL(file);

    // Load
    reader.onload = () => resolve(reader.result as string);

    // Error
    reader.onerror = (error) => reject(error);
  });
