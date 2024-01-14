import { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';

type Props = {
    fieldChange: (FILES: File[]) => void;
    changeEvent: (CHANGE: string) => void;
    mediaUrl: string;
};

const FileUploader = ({ fieldChange, changeEvent, mediaUrl }: Props) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            changeEvent(acceptedFiles[0].name);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        },
        [file]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
        },
    });

    return (
        <div
            {...getRootProps()}
            className='flex flex-center flex-col bg-dark-3 rounded-full cursor-pointer w-44 h-44'
        >
            <input {...getInputProps()} className='cursor-pointer' />
            {
                <>
                    <img
                        src={fileUrl}
                        alt='image'
                        className='rounded-full w-full h-full object-cover'
                    />
                </>
            }
        </div>
    );
};

export default FileUploader;
