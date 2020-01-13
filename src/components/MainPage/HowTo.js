import React from "react";

export default ()=>(
    <div>
        <h2>How to use UMC</h2>
        <ol className="major-ordered-list">
            <li>Create a RSA Keypair (skip if you already have a .umc file)</li>
            <ol className="minor-ordered-list">
                <li>Go to /keymanager route</li>
                <li>press "Generate Keypair" button or paste keypair from other source in the boxes</li>
                <li>Choose an Alias</li>
                <li>Press "Register Public Key" button</li>
                <li>Your SHA-256 Fingerprint in hex from will appear in the fingerprint box once your Key has been registered</li>
                <li>Optional: choose a password and press "encode" to protect your private key</li>
                <li>Press Export File (will download a .umc file named with your Alias)</li>
                <li>If you encoded your private key, decode it before going back to Main Page</li>
                <li>return to Main Page</li>
            </ol>
            <li>Import .umc file</li>
            <ol className="minor-ordered-list">
                <li>Go to /keymanager route</li>
                <li>Press "import file" button</li>
                <li>If you secured your private key with a password, enter this password and press "decode"</li>
                <li>return to Main Page</li>
            </ol>
            <li>Send someone a Message</li>
            <ol className="minor-ordered-list">
                <li>Press "Outbox" button</li>
                <li>Click on an Alias in the Contacts list</li>
                <li>Write a Message</li>
                <li>Press "Send Message" button</li>
            </ol>
            <li>Read a Message</li>
            <ol className="minor-ordered-list">
                <li>Press "Inbox" button</li>
                <li>click on the Message you would like to read (if you have any)</li>
                <li>Optional: Press Reply button to switch to Outbox with this Alias as recipient</li>
            </ol>
        </ol>
    </div>
)