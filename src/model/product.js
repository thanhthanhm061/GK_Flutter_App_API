import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        minlength: 3,  
    },
    artist: { 
        type: String, 
        required: true, 
        minlength: 3,  
    },
    audioUrl: { 
        type: String, 
        required: true,
        validate: {
          validator: function(value) {
            // Kiểm tra URL hợp lệ và kết thúc bằng các định dạng âm thanh phổ biến
            return /^https?:\/\/[^\s]+(\.mp3|\.wav|\.ogg)$/.test(value);
          },
          message: props => `${props.value} không phải là một URL hợp lệ hoặc không phải là tệp âm thanh!`
        }
      },
    lyrics: { 
        type: String, 
        required: true 
    }
}, 
{ 
    timestamps: true, 
    versionKey: false 
});

export default mongoose.model("Product", productSchema);
