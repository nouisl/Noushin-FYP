import { Modal } from 'web3uikit';

function Privacy() {

  return (
    <>
      <div style={{ height: '90vh', transform: 'scale(1)' }}>
        <div>
          <Modal id="height" isVisible onCancel={function noRefCheck() { }} onOk={function noRefCheck() { }}
            title="Privacy Policy">
            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2>Privacy Policy</h2>
              <p>This policy describes how we utilize your personal data at SmartShop.</p>
              <p>Personal data rights:</p>
              <ul>
                <li>Be informed of your personal data and request access to it</li>
                <li>Amend or update inaccurate or incomplete personal data</li>
                <li>Request to delete certain personal data</li>
                <li>Restrict the use of your personal data temporarily or permanently</li>
                <li>Request a copy of your personal data</li>
              </ul>
              <p>You can exercise the above-stated rights by emailing us.</p>
              <p>Collected personal data:</p>
              <ul>
                <li>User data: name, email address</li>
                <li>Usage data: location, attendance, events created</li>
              </ul>
              <p>To get the precise user location, users will be asked to allow us access to it through their core location library. This information will be used to fulfill the main purpose of our service, attendance tracking. Users can withdraw from sharing location information with us anytime, however, this will prevent the app from fully functioning.</p>
              <p>None of the collected data will be passed on to third-parties.</p>
              <p>Purpose of data:</p>
              <ul>
                <li>Provide our promised services</li>
                <li>Understand, diagnose and fix issues</li>
                <li>Evaluate and develop new features</li>
                <li>Use for promotion purposes</li>
                <li>Comply with legal obligation</li>
              </ul>
              <p>Sharing your personal data:</p>
              <p>Your data won’t be shared with other users or third parties. We may share your data with law enforcement to comply with legal obligation.</p>
              <p>Data retention and deletion:</p>
              <p>Loco will only keep your personal data as long as it’s necessary. If you close your account we’ll delete all data linked to you unless we are required to keep it or need to use it for a legally justifiable reason.</p>
              <p>Data safety:</p>
              <p>We’re committed to protect our users’ personal data. We have implemented appropriate measures to keep your data safe, however, no system is perfect and we will not be held liable.</p>
              <p>Right to Modify:</p>
              <p>We reserve the rights to modify the Privacy Policy given the necessity. After modification, every user needs to agree with the new policy in order to continue the use of the services provided.</p>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Privacy;
