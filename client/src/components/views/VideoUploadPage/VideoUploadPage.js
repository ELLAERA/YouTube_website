import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" }
]

function VideoUploadPage(){

    const [VideoTitle, setVideoTitle] = useState(""); 
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0); 
    const [Category, setCategory] = useState("Film & Animation"); 
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");
    
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDesciptionChange = (e) => {
        setDescription(e.currentTarget.value)
    } 

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    } 

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    } 
    
    const onDrop = (files) => {
        
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        console.log(files)

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)
                    setThumbnailPath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                    .then(response => {
                        if(response.data.success) {
                            console.log(response.data)
                        } else {
                            alert('Thumbnail creation failed.')
                        }
                    })

                } else {
                    alert("Video upload failed.")
                }
            }) 
    }

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>
            
            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        
                        {/* Drop zone */}
                        <Dropzone
                            onDrop={onDrop}
                            multiple={false}      // upload 1 video only
                            maxSize={100000000}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <Icon type="plus" style={{ fontSize: '3rem' }} />
                                </div>
                            )}
                        </Dropzone>

                        {/* Thumbnail */}

                        {ThumbnailPath &&
                            <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" /> 
                            </div>
                        }

                </div>

                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea 
                    onChange={onDesciptionChange}
                    value={Description}
                />

                <br />
                <br /> 
                <select onChange={onPrivateChange}>
                            {PrivateOptions.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                </select>

                <br />
                <br />  
                <select onChange={onCategoryChange}>
                            {CategoryOptions.map((item, index) => (
                                    <option key={index} value={item.label}>{item.label}</option>
                            ))}
                </select>

                <br />
                <br />
                <Button type='primary' size='large' onClick>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage 