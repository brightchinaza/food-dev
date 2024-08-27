import userModel from "../models/userModle.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login user 
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User Doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);


        if (!isMatch) {
            return res.json({success:false,message:"Invalid credentials"})
        }
        
        const token = createToken(user._id);
        res.json({success:true,token})


    } catch (error) {
        console.log(error);
        tes.json({success:false,message:"Error"})
        
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user

const registerUser = async (req,res) => {
    const {name,password,email} = req.body;
    try {
        //checking if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }
        //validateing email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"please enter a valid email"}) 
        }

        if (password.length<6) {
            return res.json({success:false,message:"please enter a strong password"})
        }

        // hashing user password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        }) 

        const user = await newUser.save()
        const token  = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}
// Fetch user details, total purchases, and total cart items
// const getUserDetails = async (req, res) => {
//     const userId = req.userId; // assuming userId is coming from a verified JWT token

//     try {
//         // Find user by ID
//         const user = await userModel.findById(userId).select("name email"); // only selecting necessary fields

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Calculate total purchases (sum of purchase amounts)
//         const totalPurchases = await purchaseModel.aggregate([
//             { $match: { userId: userId } }, // match purchases for this user
//             { $group: { _id: null, total: { $sum: "$amount" } } } // sum up the purchase amounts
//         ]);

//         // Count total cart items
//         const totalCartItems = await cartItemModel.countDocuments({ userId: userId });

//         // Respond with user details, total purchases, and total cart items
//         res.json({
//             success: true,
//             user: {
//                 name: user.name,
//                 email: user.email,
//                 // totalPurchases: totalPurchases.length > 0 ? totalPurchases[0].total : 0,
//                 // totalCartItems: totalCartItems
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error fetching user details" });
//     }
// };
// Fetch user details, total purchases, and total cart items
const getUserDetails = async (req, res) => {
    try {
        // Fetch all users with their ID, name, email, total purchases, and total cart items
        const users = await userModel.find({}, 'name email cart'); // Adjust as needed to include other fields

        if (!users) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        // Optionally, include additional calculations for total purchases and cart items
        // This would involve aggregating data from related collections or performing additional queries
        // For simplicity, I'm assuming these fields are available on the user model directly

        res.json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                totalPurchases: user.totalPurchases || 0, // Adjust if you need to calculate this differently
                totalCartItems: user.totalCartItems || 0 // Adjust if you need to calculate this differently
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};
// Fetch user details, total purchases, and total cart items
const getEditUserDetails = async (req, res) => {
    const userId = req.params.id; // Extract userId from path parameters

    try {
        // Find user by ID
        const user = await userModel.findById(userId).select("id name email password"); // Adjust fields as needed

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Respond with user details
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching user details" });
    }
};
const updateUserInfo = async (req, res) => {
    const { id } = req.params; // Extract user ID from the URL
    const { name, email, password } = req.body; // Extract user info from the request body

    if (!id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        // Find user by ID
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user information
        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            // Hash the new password if provided
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user information
        await user.save();

        res.json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating user information" });
    }
};


export { loginUser, registerUser, getUserDetails, getEditUserDetails, updateUserInfo}