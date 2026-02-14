import ContactUs from "../../models/enquiry/ContactUs.js";

export const addContactUs = async (req, res) => {
  try {
    const { name, email, mobile_no, subject, message } = req.body;

    if (!name || !email || !mobile_no || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new ContactUs({
      name,
      email,
      mobile_no,
      subject,
      message,
    });

    await newContact.save();

    return res
      .status(201)
      .json({ message: "Contact message submitted successfully" });
  } catch (error) {
    console.error("Add Contact Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while submitting contact message" });
  }
};
