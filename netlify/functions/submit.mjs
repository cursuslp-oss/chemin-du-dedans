import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const MATHIEU_EMAIL = process.env.MATHIEU_EMAIL || 'contact@biocursus.fr';
const FROM_EMAIL = process.env.FROM_EMAIL || 'BIOCURSUS <noreply@biocursus.fr>';

function buildPersonEmail(name, synthesis) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C4956A;font-family:Helvetica,Arial,sans-serif;">BIOCURSUS</span>
    </div>

    <h1 style="font-size:28px;font-weight:400;color:#f0ece4;text-align:center;margin:0 0 8px;">Le Chemin du Dedans</h1>
    <p style="font-size:15px;color:#C4956A;text-align:center;font-style:italic;margin:0 0 40px;">Ta synth&egrave;se personnalis&eacute;e</p>

    <p style="font-size:15px;line-height:1.8;color:rgba(232,228,220,0.8);margin:0 0 28px;">
      ${name}, voici ce que tes r&eacute;ponses au questionnaire ont mis en lumi&egrave;re.
    </p>

    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(196,149,106,0.2);border-radius:6px;padding:28px 24px;margin-bottom:36px;">
      ${synthesis.split('\n').filter(l => l.trim()).map(line => {
        const trimmed = line.trim();
        const isTitle = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 30;
        if (isTitle) {
          return `<p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C4956A;margin:24px 0 10px 0;font-family:Helvetica,Arial,sans-serif;">${trimmed}</p>`;
        }
        return `<p style="font-size:15px;line-height:1.9;color:rgba(232,228,220,0.75);margin:0 0 10px;">${trimmed}</p>`;
      }).join('\n')}
    </div>

    <div style="text-align:center;margin-bottom:16px;">
      <div style="width:48px;height:1px;background:linear-gradient(90deg,transparent,rgba(196,149,106,0.4),transparent);margin:0 auto 28px;"></div>
      <p style="font-size:16px;line-height:1.8;color:rgba(232,228,220,0.5);font-style:italic;margin:0 0 32px;">
        &laquo; Nous ne sommes pas les nuages, ni la foudre, ni la pluie. Nous sommes le ciel. &raquo;
      </p>
    </div>

    <div style="text-align:center;margin-bottom:40px;">
      <p style="font-size:15px;line-height:1.7;color:rgba(232,228,220,0.55);margin:0 0 20px;">
        Si tu veux aller plus loin et travailler sur ce que ce questionnaire a mis en lumi&egrave;re, tu peux r&eacute;server une s&eacute;ance avec Mathieu.
      </p>
      <a href="https://tidycal.com/cursuslp/chemindudedans" target="_blank" style="display:inline-block;background:rgba(196,149,106,0.12);border:1px solid rgba(196,149,106,0.5);color:#C4956A;padding:14px 40px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-family:Helvetica,Arial,sans-serif;border-radius:2px;">
        R&eacute;server ma s&eacute;ance
      </a>
    </div>

    <div style="text-align:center;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);">
      <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(232,228,220,0.2);font-family:Helvetica,Arial,sans-serif;">BIOCURSUS &bull; Approche fonctionnelle et hypnose</span>
    </div>

  </div>
</body>
</html>`;
}

function buildMathieuEmail(name, email, answers, synthesis) {
  const labels = {
    q1: 'Situation qui p\u00e8se',
    q2: 'Responsable d\u00e9sign\u00e9',
    q3: 'Sch\u00e9ma r\u00e9current',
    q3b: 'Ce que les situations ont en commun',
    q4: 'Si la situation disparaissait',
    q5: 'Ressenti corporel',
    q6: 'Depuis quand ce ressenti',
    q7: 'Ce qu\'elle veut vraiment',
    q8: 'Ce que la situation montre d\'elle',
    q9: 'Ce qu\'elle veut se rappeler',
    q10: 'Son choix'
  };

  let answersHtml = '';
  for (const [key, label] of Object.entries(labels)) {
    if (answers[key]) {
      answersHtml += `
        <div style="margin-bottom:16px;">
          <strong style="color:#C4956A;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${label}</strong>
          <p style="color:#e8e4dc;font-size:14px;line-height:1.7;margin:4px 0 0;">${answers[key]}</p>
        </div>`;
    }
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:32px 24px;">

    <h2 style="color:#f0ece4;font-size:20px;font-weight:400;margin:0 0 8px;">Nouvelle soumission : Le Chemin du Dedans</h2>
    <p style="color:rgba(232,228,220,0.5);font-size:13px;margin:0 0 28px;">${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>

    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(196,149,106,0.3);border-radius:6px;padding:20px;margin-bottom:24px;">
      <p style="color:#C4956A;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Contact</p>
      <p style="color:#f0ece4;font-size:16px;margin:0;">
        ${name}<br/>
        <a href="mailto:${email}" style="color:#C4956A;">${email}</a>
      </p>
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:20px;margin-bottom:24px;">
      <p style="color:#C4956A;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">R&eacute;ponses</p>
      ${answersHtml}
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(196,149,106,0.15);border-radius:6px;padding:20px;">
      <p style="color:#C4956A;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Synth&egrave;se g&eacute;n&eacute;r&eacute;e</p>
      <p style="color:rgba(232,228,220,0.7);font-size:14px;line-height:1.8;margin:0;white-space:pre-line;">${synthesis}</p>
    </div>

  </div>
</body>
</html>`;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { name, email, answers, synthesis } = JSON.parse(event.body);

    if (!name || !email || !synthesis) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Champs manquants' }) };
    }

    // Email to the person
    const personResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${name}, voici ta synth\u00e8se \u2013 Le Chemin du Dedans`,
      html: buildPersonEmail(name, synthesis)
    });

    // Email to Mathieu
    const mathieuResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: MATHIEU_EMAIL,
      subject: `Chemin du Dedans \u2013 ${name} (${email})`,
      html: buildMathieuEmail(name, email, answers, synthesis)
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erreur lors de l\'envoi' })
    };
  }
}
