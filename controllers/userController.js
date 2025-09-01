import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth(); // make sure req.auth() returns { userId }

    const creations = await sql`
      SELECT * FROM CREATIONS 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    });
  }
};
export const getPublishedCreations = async (req, res) => {
  try {
    // make sure req.auth() returns { userId }

    const creations = await sql`
      SELECT * FROM CREATIONS 
      WHERE publish=true
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    });
  }
};
export const toggelLikeCreations = async (req, res) => {
  try {
    // make sure req.auth() returns { userId }
     const {userId}=req.auth();
     const {id}=req.body;
     
     const [creation]=await sql`SELECT * FROM creations WHERE id=${id}`
     if(!creation){
        return res.json({
            success:false,
            msg:"Creation Not Found"
        })
     }

     const currentLikes=creation.likes;
     const useridStr=userId.toString();
     let updatedLikes;
     let message;
     if(currentLikes.includes(useridStr)){
        updatedLikes=currentLikes.filter((user)=>user!=useridStr);
        message='creation unliked'
     }
     else{
        updatedLikes=[...currentLikes,useridStr];
        message='creation liked'
     }
    const formatedArray=`{${updatedLikes.join(',')}}`

    const creations = await sql`
      UPDATE CREATIONS 
      SET likes=${formatedArray}::text[]
      WHERE id=${id}
    `;

    res.json({
      success: true,
      message:message,
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    });
  }
};
