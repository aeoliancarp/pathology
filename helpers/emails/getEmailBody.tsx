/* istanbul ignore file */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EnrichedLevel } from '../../models/db/level';
import User from '../../models/db/user';

// good place to test the output:
// https://htmlemail.io/inline/
export default function getEmailBody(
  levelOfDay: EnrichedLevel | null,
  notificationsCount: number,
  title: string,
  user: User,
  message?: string,
) {
  return renderToStaticMarkup(
    <html>
      <body>
        <table role='presentation' cellPadding='0' cellSpacing='0' style={{
          backgroundColor: '#FFF',
          borderCollapse: 'separate',
          fontFamily: 'sans-serif',
          width: '100%',
        }}>
          <tr>
            <td align='center' style={{
              display: 'block',
              padding: 20,
              verticalAlign: 'top',
            }}>
              <table role='presentation' cellPadding='0' cellSpacing='0' style={{
                color: '#000',
                maxWidth: 580,
              }}>
                <tr>
                  <td>
                    <div style={{
                      borderColor: '#BBB',
                      borderRadius: 20,
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 20,
                    }}>
                      <a href='https://pathology.gg'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src='https://i.imgur.com/fD1SUrZ.png' alt='Pathology' />
                      </a>
                      <h1>Hi {user.name},</h1>
                      <p>{title}</p>
                      {notificationsCount > 0 && (
                        <p>You have <a href='https://pathology.gg/notifications?source=email-digest&filter=unread' style={{
                          color: '#4890ce',
                          textDecoration: 'none',
                        }}>{notificationsCount} unread notification{notificationsCount !== 1 ? 's' : ''}</a></p>
                      )}
                      {message && (
                        <p>{message}</p>
                      )}
                      {levelOfDay &&
                      <div>
                        <h2>Check out the level of the day:</h2>
                        <div style={{
                          textAlign: 'center',
                        }}>
                          <a href={`https://pathology.gg/level/${levelOfDay.slug}`} style={{
                            color: '#4890ce',
                            textDecoration: 'none',
                          }}>
                            {levelOfDay.name}
                          </a>
                          {' by '}
                          <a href={`https://pathology.gg/profile/${encodeURI(levelOfDay.userId.name)}`} style={{
                            color: '#4890ce',
                            textDecoration: 'none',
                          }}>
                            {levelOfDay.userId.name}
                          </a>
                          <div style={{
                            padding: 20,
                          }}>
                            <a href={`https://pathology.gg/level/${levelOfDay.slug}`} style={{
                              color: '#4890ce',
                              textDecoration: 'none',
                            }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={`https://pathology.gg/api/level/image/${levelOfDay._id}.png`} width='100%' alt={levelOfDay.name} />
                            </a>
                          </div>
                        </div>
                      </div>
                      }
                      <div style={{
                        padding: 10,
                        textAlign: 'center',
                      }}>
                      Thanks for playing <a href='https://pathology.gg' style={{
                          color: '#4890ce',
                          textDecoration: 'none',
                        }}>Pathology</a>!
                      </div>
                      <div id='footer' style={{
                        fontSize: '10px',
                        color: '#999',
                        textAlign: 'center',
                      }}>
                        <p>Join the <a href='https://discord.gg/kpfdRBt43v' style={{
                          color: '#4890ce',
                          textDecoration: 'none',
                        }}>Pathology Discord</a> to chat with other players and the developers!</p>
                        <p><a href='https://pathology.gg/settings' style={{
                          color: '#4890ce',
                          textDecoration: 'none',
                        }}>Manage your email notification settings</a></p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
