export const generateEmailTemplate = (content) => `
<div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; background-color: #ffffff;">

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">

        <h1 style="color: #1E90FF; text-align: center; font-size: 28px; margin-bottom: 20px;">EULOGES</h1>

        <div style="color: #000000; font-size: 16px; line-height: 1.5;">
            ${content}
        </div>

        <footer style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
            <p style="color: #1E90FF;">© 2025 EULOGES. All rights reserved.</p>
        </footer>

    </div>
</div>
`;    /// General template for brand


export const signUpEmailTemplate = (content) => `
<div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; background-color: #ffffff;">

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">

        <h1 style="color: #1E90FF; text-align: center; font-size: 28px; margin-bottom: 20px;">EULOGES USER REGISTRATION</h1>

        <div style="color: #000000; font-size: 16px; line-height: 1.5;">
            ${content}
        </div>

        <footer style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
            <p style="color: #1E90FF;">© 2025 EULOGES. All rights reserved.</p>
        </footer>

    </div>
</div>
`

export const signInEmailTemplate = (content) => `
<div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; background-color: #ffffff;">

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">

        <h1 style="color: #1E90FF; text-align: center; font-size: 28px; margin-bottom: 20px;">EULOGES LOGIN UPDATE</h1>

        <div style="color: #000000; font-size: 16px; line-height: 1.5;">
            ${content}
        </div>

        <footer style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
            <p style="color: #1E90FF;">© 2025 EULOGES. All rights reserved.</p>
        </footer>

    </div>
</div>
`

export const userUpdateEmailTemplate = (content) => `
<div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; background-color: #ffffff;">

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">

        <h1 style="color: #1E90FF; text-align: center; font-size: 28px; margin-bottom: 20px;">EULOGES PROFILE UPDATES</h1>

        <div style="color: #000000; font-size: 16px; line-height: 1.5;">
            ${content}
        </div>

        <footer style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
            <p style="color: #1E90FF;">© 2025 EULOGES. All rights reserved.</p>
        </footer>

    </div>
</div>
`