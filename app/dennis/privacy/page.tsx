import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dennis Mellowisper — Privacy Policy",
  description: "How the personal Dennis Mellowisper publishing tool accesses, uses, stores and shares information, including YouTube API data.",
  alternates: { canonical: "https://ninolive.co.uk/dennis/privacy" },
};

export default function DennisPrivacyPage() {
  return (
    <>
      <section>
        <h1>Privacy policy</h1>
        <p className="mt-3 text-sm text-stone-600">Last updated: 23 October 2026</p>
        <p>Dennis Mellowisper is a personal video creation and publishing tool operated by the owner of the Mellowisper channels. It runs on the owner’s computer and is not offered as a public account-based service. This policy describes the tool’s data practices and these public information pages.</p>
        <p>Contact the operator at <a href="mailto:dennisproductions975@gmail.com">dennisproductions975@gmail.com</a> for privacy questions, access requests or deletion requests.</p>
      </section>
      <section>
        <h2>Information the tool accesses and stores</h2>
        <ul>
          <li>Owner-provided ideas, scripts, generated illustrations and narration, video files, titles, descriptions, captions and publishing schedules.</li>
          <li>Google OAuth access and refresh tokens needed to use the authorised YouTube connection. Dennis does not collect or store the owner’s Google password.</li>
          <li>The connected YouTube channel’s identifier and title, plus upload identifiers, video links, visibility, processing status and publication records returned by YouTube API Services.</li>
          <li>Equivalent connection credentials and posting records for the owner’s configured Instagram and TikTok publishing routes.</li>
          <li>Operational logs, errors and checks needed to troubleshoot generation and publishing and avoid duplicate uploads.</li>
        </ul>
        <p>The Google permissions requested are YouTube upload and YouTube read-only access. The current workflow uses read-only access to verify the channel and uploads; it does not request Gmail, Drive or Contacts permissions.</p>
      </section>
      <section>
        <h2>How information is used</h2>
        <p>Information is used to create the owner’s videos, carry out the owner’s approved publishing workflow, verify the correct destination channel, record publication, prevent duplicates and investigate errors. Connecting an account authorises the configured tool; these website pages do not request account access.</p>
        <p>Google user data is not sold, used for advertising profiles, or provided to AI services to train models. Dennis’s use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including its Limited Use requirements.</p>
      </section>
      <section>
        <h2>Storage and sharing</h2>
        <p>The tool stores credentials in restricted local files and keeps project files and publishing records on the owner’s computer. The operator controls access to that computer and its private database. Credentials are not published on this website.</p>
        <p>When publishing, Dennis sends the chosen video and relevant metadata to the destination platform. YouTube uploads use Google’s API directly. Instagram publishing uses Meta’s API and a temporary media link. TikTok publishing uses Buffer’s API and a temporary media link. Cloudflare R2 holds temporary media copies; Instagram links are signed, while the TikTok transport uses a publicly retrievable link until the temporary copy is removed. These copies contain media intended for publication, not Google authentication tokens.</p>
        <p>AI services are used to create scripts and illustrations from the owner’s creative input. Google OAuth tokens and data retrieved from the YouTube account are not supplied as creative input. YouTube account data is not shared with Instagram, TikTok or Buffer to publish on those platforms.</p>
        <p>Publishing status or failure notifications may be sent to the owner’s private Slack channel through the existing notification service. Those notifications can contain video titles, published links and error summaries, but are not intended to contain authentication credentials.</p>
        <p>Published videos and descriptions are visible according to the destination platform’s settings. Those platforms handle information under their own policies, including the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>. Dennis uses YouTube API Services and its YouTube features are subject to the <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>.</p>
      </section>
      <section>
        <h2>Retention, deletion and revoking access</h2>
        <p>Local media, project history and publication records are kept for the owner’s publishing workflow, troubleshooting and duplicate prevention until no longer needed or deletion is requested. Temporary cloud media copies are configured for automatic cleanup. Removing a video from a workflow list may retain the original files and history; it is not a request to erase all stored data.</p>
        <p>To request deletion of stored Google/YouTube data or other Dennis records, contact <a href="mailto:dennisproductions975@gmail.com">dennisproductions975@gmail.com</a>. The operator will handle deletion requests as soon as possible and within seven calendar days. Deleting local Dennis records does not delete videos already held by YouTube or another platform; manage those videos through the relevant platform.</p>
        <p>The owner can revoke Dennis’s Google access at any time through <a href="https://security.google.com/settings/security/permissions">Google Account permissions</a>. Revocation prevents further authorised API access. The operator must also remove the associated local credentials and Google/YouTube data; contact the operator to arrange this deletion. Reconnecting requires Google authorisation again.</p>
      </section>
      <section>
        <h2>These information pages</h2>
        <p>These pages are hosted on NinoLive through Vercel. The hosting provider may process technical request information such as IP address, requested URL and browser information to deliver and protect the website. The Dennis pages add no advertising trackers, analytics scripts, account forms or Google sign-in controls. They do not publish the tool’s private database or credentials.</p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>This policy will be updated if the tool’s data practices change. The date above identifies the latest version. Additional Google permissions or materially different uses of Google data require an updated disclosure and renewed consent where applicable.</p>
      </section>
    </>
  );
}
