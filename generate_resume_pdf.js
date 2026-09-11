import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function createResume() {
  const pdfDoc = await PDFDocument.create();
  // Standard A4 dimensions in points: 595.28 x 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const leftMargin = 50;
  const rightMargin = 50;
  const contentWidth = width - leftMargin - rightMargin;
  let y = height - 48;

  const colorBlack = rgb(0.1, 0.1, 0.1);
  const colorDarkGray = rgb(0.25, 0.25, 0.25);
  const colorGray = rgb(0.4, 0.4, 0.4);

  // Helper function to draw centered text
  function drawCenteredText(text, fontSize, font, color = colorBlack) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const x = (width - textWidth) / 2;
    page.drawText(text, { x, y, size: fontSize, font, color });
    y -= fontSize + 4;
  }

  // Helper function to draw wrapped paragraph
  function drawWrappedText(text, fontSize, font, color = colorBlack, indent = 0, lineHeight = 1.35) {
    const words = text.split(' ');
    let currentLine = '';
    const maxW = contentWidth - indent;

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxW && currentLine) {
        page.drawText(currentLine, { x: leftMargin + indent, y, size: fontSize, font, color });
        y -= fontSize * lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      page.drawText(currentLine, { x: leftMargin + indent, y, size: fontSize, font, color });
      y -= fontSize * lineHeight;
    }
  }

  // Section Heading Helper
  function drawSectionHeading(title) {
    y -= 7;
    page.drawText(title, {
      x: leftMargin,
      y,
      size: 10.5,
      font: fontBold,
      color: colorBlack,
    });
    y -= 12;
  }

  // 1. Header
  drawCenteredText('KARINA SINGH', 20, fontBold);
  y += 1;
  drawCenteredText('BTech CSE (IoT) Student | Aspiring Software Engineer | AI/ML Enthusiast', 9.5, fontRegular, colorDarkGray);
  y -= 4;

  // 2. Career Objective
  drawSectionHeading('CAREER OBJECTIVE');
  drawWrappedText(
    'Motivated BTech Computer Science and Engineering (IoT) student interested in software development, Artificial Intelligence, Machine Learning, and IoT. Building practical skills in Java, Python, web development, DSA, and AI/ML while developing real-world projects. Seeking internship opportunities to apply technical knowledge and problem-solving skills.',
    8.8,
    fontRegular,
    colorDarkGray,
    0,
    1.32
  );

  // 3. Education
  drawSectionHeading('EDUCATION');
  page.drawText('Bakhtiyarpur College of Engineering, Bihar — B.Tech, Computer Science & Engineering (IoT) | 2025–2029', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: colorBlack,
  });
  y -= 12;
  page.drawText('Currently in 2nd Year | Class XII: 76.6% | Class X: 86.6%', {
    x: leftMargin,
    y,
    size: 8.8,
    font: fontRegular,
    color: colorDarkGray,
  });
  y -= 12;

  // 4. Technical Skills
  drawSectionHeading('TECHNICAL SKILLS');
  const skills = [
    { label: 'Programming', value: 'Java, Python, JavaScript, TypeScript' },
    { label: 'Web', value: 'HTML5, CSS3, React.js, Tailwind CSS, Node.js' },
    { label: 'Database', value: 'MySQL, MongoDB, Mongoose, Supabase' },
    { label: 'AI/ML', value: 'AI/ML Fundamentals, Google AI Studio, LLMs, RAG Fundamentals' },
    { label: 'IoT', value: 'ESP32, IoT Sensor Integration, Embedded Systems' },
    { label: 'Tools', value: 'Git, GitHub, VS Code, Chrome Extension API' },
  ];

  for (const s of skills) {
    page.drawText(s.label, {
      x: leftMargin,
      y,
      size: 8.8,
      font: fontBold,
      color: colorBlack,
    });
    page.drawText(s.value, {
      x: leftMargin + 95,
      y,
      size: 8.8,
      font: fontRegular,
      color: colorDarkGray,
    });
    y -= 11.5;
  }

  // 5. Projects
  drawSectionHeading('PROJECTS');

  // Project 1
  page.drawText('AI-Powered Email Threat Detection & Forensic Intelligence Platform', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: colorBlack,
  });
  y -= 11.5;
  const p1Bullets = [
    'Explored AI-based suspicious and malicious email detection.',
    'Worked with SPF, DKIM, and DMARC concepts for email authentication.',
    'Explored threat detection, geolocation, and digital forensic intelligence.',
  ];
  for (const b of p1Bullets) {
    page.drawText('•', { x: leftMargin + 6, y, size: 8.8, font: fontBold, color: colorBlack });
    page.drawText(b, { x: leftMargin + 16, y, size: 8.8, font: fontRegular, color: colorDarkGray });
    y -= 11;
  }
  y -= 2;

  // Project 2
  page.drawText('Gamified Workout & Fitness Analyzer', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: colorBlack,
  });
  y -= 11.5;
  const p2Bullets = [
    'Designed workout levels, rewards, streaks, and progress tracking.',
    'Explored AI-based camera/video analysis for workout form detection.',
    'Planned backend architecture using Node.js, Express.js, and MongoDB.',
  ];
  for (const b of p2Bullets) {
    page.drawText('•', { x: leftMargin + 6, y, size: 8.8, font: fontBold, color: colorBlack });
    page.drawText(b, { x: leftMargin + 16, y, size: 8.8, font: fontRegular, color: colorDarkGray });
    y -= 11;
  }
  y -= 2;

  // Project 3
  page.drawText('IoT-Based Sensor Projects', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: colorBlack,
  });
  y -= 11.5;
  const p3Bullets = [
    'Worked with ESP32 and IoT sensor integration.',
    'Explored sensor-based movement and fatigue detection concepts.',
  ];
  for (const b of p3Bullets) {
    page.drawText('•', { x: leftMargin + 6, y, size: 8.8, font: fontBold, color: colorBlack });
    page.drawText(b, { x: leftMargin + 16, y, size: 8.8, font: fontRegular, color: colorDarkGray });
    y -= 11;
  }

  // 6. Experience
  drawSectionHeading('EXPERIENCE');
  page.drawText('Technology / AI Internship — [Company/Organization Name] | [Dates]', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: colorBlack,
  });
  y -= 11.5;
  const expBullets = [
    'Gained practical exposure to professional technology workflows and assigned project tasks.',
    'Applied programming, research, and problem-solving skills in a real-world environment.',
    'Collaborated with team members and strengthened technical and communication skills.',
  ];
  for (const b of expBullets) {
    page.drawText('•', { x: leftMargin + 6, y, size: 8.8, font: fontBold, color: colorBlack });
    page.drawText(b, { x: leftMargin + 16, y, size: 8.8, font: fontRegular, color: colorDarkGray });
    y -= 11;
  }

  // 7. Certifications & Activities
  drawSectionHeading('CERTIFICATIONS & ACTIVITIES');
  const certBullets = [
    'Google AI / AI-related learning programs and Google Skills Badges.',
    'Participated in college-level hackathon activities and Smart India Hackathon (SIH) preparation.',
    'Currently learning AI/ML, Java, DSA, web development, and software engineering.',
  ];
  for (const b of certBullets) {
    page.drawText('•', { x: leftMargin + 6, y, size: 8.8, font: fontBold, color: colorBlack });
    page.drawText(b, { x: leftMargin + 16, y, size: 8.8, font: fontRegular, color: colorDarkGray });
    y -= 11;
  }

  // 8. Soft Skills
  drawSectionHeading('SOFT SKILLS');
  page.drawText('Problem Solving • Teamwork • Communication • Adaptability • Research • Continuous Learning', {
    x: leftMargin,
    y,
    size: 8.8,
    font: fontRegular,
    color: colorDarkGray,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('resume.pdf', pdfBytes);
  fs.writeFileSync('public/resume.pdf', pdfBytes);
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/resume.pdf', pdfBytes);
  }
  console.log('Successfully generated resume.pdf (' + pdfBytes.length + ' bytes)');
}

createResume().catch(console.error);
