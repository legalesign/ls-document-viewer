const getGroupData = (id: string) => {
  return `
        query getGroupData {
        group(id: "${id}"){
          id          
          standardMessageConnection{
            messages  {
              id
              name
              default
              body
              created
              modified
            }
          }
          scheduleConnection {
            schedules {
              id
              name
              items {
                id
                daysAfter
                frequency
                subject
                message
                when
                timeOfDay
                skipWeekend
              }
              default
            }
          }
          experienceConnection{
            experiences  {
              id
              name
              language
              defaultExperience
              witnessSameDevice
              allowSignatureReuse
              attachDraft
              canReassign
              defaultReminderSubject
              defaultSubject
              finalSignerEmailSubHeader
              finalSignerEmailText
              footerTextColour
              forwarding
              penDiameter
              postSignAttach
              postSignEmail
              rejectedEmailSubheader
              senderName
              signatureAppendDate
              signatureDoneText
              signatureMouse
              signatureType
              signatureCertifiedType
              signatureUpload
              signatureAppend
              signatureAppendExtra
              signingPageText
              textBackgroundColour
              textFontColour
              typedSignatureFixedSize
              created
              modified
              witnessingRequiresSignerSMS
              witnessingRequiresWitnessSMS
            }
          }
          attachmentConnection {
            attachments {
              id
              filename
              autoAttach
              description
              created
            }
          }
          contactConnection {
            contacts{
              id
              firstName
              lastName
              email
              phoneNumber
              name
            }
          }
        }
      }
      `;
};

export { getGroupData };
