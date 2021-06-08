import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Select } from 'antd';
import { GatewayOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';

import { feedbackUrl, deploymentUrl } from '../../config';

import styles from './styles.module.scss';


const { TextArea } = Input;
const { Option } = Select;

const FEEDBACK_CONTACT_KEY = 'feedbackContact';
const storage = typeof (window) !== 'undefined' ? window.sessionStorage : null;


const Feedback: React.FC = () => {
  const router = useRouter()

  const [formVisible, setFormVisible] = useState(false);
  const issueSelectRef = useRef<HTMLSelectElement>(null);

  const [type, setType] = useState(null);
  const [component, setComponent] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState(storage?.getItem(FEEDBACK_CONTACT_KEY) ?? '');

  const [sending, setSending] = useState(false);
  const [responseStatus, setResponseStatus] = useState<'success' | 'error'>(null)

  const onContactChange = (value: string) => {
    storage?.setItem(FEEDBACK_CONTACT_KEY, value);
    setContact(value);
  };

  const showForm = () => {
    setFormVisible(true);
    issueSelectRef?.current?.focus();
  };

  const closeForm = () => {
    setFormVisible(false);

    setTimeout(() => {
      setType(null);
      setComponent('');
      setDetails('');

      setResponseStatus(null)
    }, 200);
  }

  const sendFeedback = async () => {
    setResponseStatus(null)
    setSending(true);

    const pageUrl = `${deploymentUrl}/${router.basePath}/${router.asPath}`;

    try {
      const res = await fetch(`${feedbackUrl}/hippocampus-model-portal/issues`, {
        method: 'POST',
        body: JSON.stringify({
          title: details.slice(0, 100),
          body: [
            `Field | Element`,
            `--- | ---`,
            `Issue type | ${type || '--'}`,
            `Page URL | [${router.asPath}](${pageUrl})`,
            `Component | ${component || '--'}`,
            `Contact | ${contact || '--'}`,
            ``,
            `${details.slice(100)}`,
          ].join('\n'),
          labels: ['triage']
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic c3NjeDphZXc0b29TaA==',
        },
      })
      if (res.ok) {
        setResponseStatus('success');
        setTimeout(closeForm, 1000);
      } else setResponseStatus('error')

      setSending(false);
    } catch (e) {
      setResponseStatus('error')
    } finally {
      setSending(false)
    }
  }



  return (
    <div className={`${formVisible ? styles.formVisible : ''}`}>
      <div
        className={styles.feedbackButton}
        onClick={showForm}
      >
        Feedback
      </div>
      <div id="feedbackForm" className={styles.form}>
        <div className={styles.closeBtn}>
          <Button
            shape="circle"
            type="primary"
            danger
            icon={<CloseOutlined />}
            onClick={closeForm}
          />
        </div>
        <Form size="small" onSubmitCapture={sendFeedback}>
          <Form.Item>
            <Select
              placeholder="Feedback type (optional)"
              ref={issueSelectRef}
              disabled={sending}
              getPopupContainer={() => document.getElementById('feedbackForm')}
              value={type}
              onChange={(value) => setType(value as string)}
            >
              <Option value="content">Content</Option>
              <Option value="layout">Layout, UI</Option>
              <Option value="navigation">Navigation, UX</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Component / page section (optional)"
              prefix={<GatewayOutlined />}
              disabled={sending}
              value={component}
              onChange={e => setComponent(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <TextArea
              placeholder="Tell us about your experience..."
              rows={4}
              disabled={sending}
              autoSize={{ minRows: 4, maxRows: 4 }}
              value={details}
              onChange={e => setDetails(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Contact name / email (optional)"
              prefix={<UserOutlined />}
              disabled={sending}
              value={contact}
              onChange={e => onContactChange(e.target.value)}
              onPressEnter={sendFeedback}
            />
          </Form.Item>
          <Form.Item className="text-right mb-0">
            {responseStatus === 'success' && (
              <span className="mr-1">Sent, thank you!</span>
            )}
            {responseStatus === 'error' && (
              <span className="mr-1 text-red">Oops, something went wrong</span>
            )}
            <Button
              className={styles.sendBtn}
              type="primary"
              danger
              disabled={!details || responseStatus === 'success'}
              loading={sending}
              onClick={sendFeedback}
            >
              {sending ? 'Sending' : 'Send'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};


export default Feedback;
