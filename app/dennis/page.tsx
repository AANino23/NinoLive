import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dennis Mellowisper — Personal Video Publishing",
  description: "Dennis Mellowisper is a private, owner-operated tool for creating original illustrated videos and publishing them to the owner's social channels.",
  alternates: { canonical: "https://ninolive.co.uk/dennis" },
};

export default function DennisPage() {
  return (
    <>
      <section>
        <h1>A personal studio for Mellowisper.</h1>
        <p className="mt-5">Dennis Mellowisper is a personal desktop tool used by its owner to create original illustrated videos, prepare captions and descriptions, and publish them to the owner’s Mellowisper social channels.</p>
        <p>This website provides information about the tool. The studio itself runs privately on the owner’s computer; it is not a public service and does not offer visitor accounts or a public sign-in.</p>
      </section>
      <section>
        <h2>How publishing works</h2>
        <p>The owner approves ideas and controls the publishing schedule. Dennis creates the video and checks the result before placing it in the approved publishing queue. Connected platform APIs publish the videos at the configured times and return records of what was posted.</p>
        <p>Dennis can publish to YouTube, Instagram and TikTok through their configured API connections. Publication is only to accounts authorised by the owner.</p>
      </section>
      <section>
        <h2>Why Dennis connects to Google</h2>
        <p>Dennis uses YouTube API Services. Google authorisation allows it to upload the owner’s videos and accompanying titles and descriptions, confirm the connected YouTube channel, and check the status of its uploads. It requests YouTube upload and read-only permissions. It does not request access to Gmail, Google Drive or Google Contacts.</p>
        <p>Google sign-in is used to connect the local tool to the owner’s channel. Visiting these information pages does not connect a Google account or grant Dennis access to it.</p>
      </section>
      <section>
        <h2>Privacy and control</h2>
        <p>Read the <Link href="/dennis/privacy">Dennis privacy policy</Link> for details of the information used, local storage, sharing and how to revoke access or request deletion.</p>
        <p>By using Dennis’s YouTube features, the owner agrees to be bound by the <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>. Google’s handling of information is described in the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.</p>
        <p>Questions about Dennis: <a href="mailto:dennisproductions975@gmail.com">dennisproductions975@gmail.com</a>.</p>
      </section>
    </>
  );
}
