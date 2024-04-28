export const BASE_URL = "http://127.0.0.1:8000/api"

export const getConfig = (token, contentType) => {
    const config = {
        headers: {
            "Content-type": contentType || "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    return config
}

export const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
    ]
}
