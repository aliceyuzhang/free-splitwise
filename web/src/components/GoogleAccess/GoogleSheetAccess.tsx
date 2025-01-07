import { useEffect, useState } from 'react'

import { Button, Label, TextInput, Modal } from 'flowbite-react'

import { navigate } from '@redwoodjs/router'

const CLIENT_ID = '<CLIENT_ID>' // TODO: change this
const SCOPE = 'https://www.googleapis.com/auth/drive.readonly'
const TTL = 30 // 30 min
const LS_GOOGLE_ACCESS_TOKEN_KEY = 'google-access-token'

const GoogleAccess = () => {
  const [fileURL, setFileURL] = useState('')
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true) // Step 1
  const [isFileInputModalOpen, setIsFileInputModalOpen] = useState(false) // Step 2

  const handleSignIn = () => {
    const expiryms = new Date(new Date().getTime() + TTL * 60 * 1000)
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response: { access_token: string }) => {
        setAccessToken(response.access_token)
        localStorage.setItem(
          LS_GOOGLE_ACCESS_TOKEN_KEY,
          JSON.stringify({
            token: response.access_token,
            expiry_ms: expiryms,
          })
        )
        setIsAuthModalOpen(false)
        setIsFileInputModalOpen(true)
      },
    })

    // Request an access token
    tokenClient.requestAccessToken()
  }

  useEffect(() => {
    const item = localStorage.getItem(LS_GOOGLE_ACCESS_TOKEN_KEY)
    if (item!) {
      const json = JSON.parse(item)
      const storedAccessToken = json['token']
      const expiryMs = new Date(json['expiry_ms'])
      if (
        item &&
        storedAccessToken &&
        expiryMs >= new Date(new Date().getTime())
      ) {
        setAccessToken(storedAccessToken)
      } else {
        localStorage.removeItem(LS_GOOGLE_ACCESS_TOKEN_KEY)
        setAccessToken(null)
      }
    }
  })

  const onGoogleSheetURLSubmit = async (fileId: string) => {
    if (!accessToken) {
      console.error('Access token is not available. Please sign in.')
      return
    }

    try {
      // Fetch file metadata from Google Drive API
      const metadataResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const metadata = await metadataResponse.json()

      if (metadata.mimeType === 'application/vnd.google-apps.spreadsheet') {
        navigate(`/expense-group?id=google-${fileId}`)
      } else {
        console.error('Unsupported file type:', metadata.mimeType)
      }
    } catch (error) {
      console.error('Error fetching file data:', error)
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    // Extract fileId from the sheet URL
    const fileIdMatch = fileURL.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1]
      onGoogleSheetURLSubmit(fileId)
    } else {
      console.error('Invalid Google Sheets URL')
    }
  }

  return (
    <div>
      {/* Step 1: Authentication Modal */}
      <Modal
        show={isAuthModalOpen && !accessToken}
        onClose={() => {}}
        size="lg"
      >
        <Modal.Header>Sign in with Google</Modal.Header>
        <Modal.Body className="spacing">
          <p className="text-gray-700 bottom-spacing">
            Please sign in with your Google account to access Google Drive
            files.
          </p>
          <Button onClick={handleSignIn}>Sign in now</Button>
        </Modal.Body>
      </Modal>

      {/* Step 2: File Input Modal */}
      <Modal
        show={isFileInputModalOpen || !!accessToken}
        onClose={() => setIsFileInputModalOpen(false)}
        size="lg"
      >
        <Modal.Header>Enter Google Sheets URL</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="googlefilelink"
                  value="Google Sheets File Link"
                />
              </div>
              <TextInput
                id="googlefilelink"
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/123456789"
                value={fileURL}
                onChange={(e) => setFileURL(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default GoogleAccess
