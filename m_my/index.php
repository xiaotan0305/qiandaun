<?php
/**
 * Project:     �ֻ��ѷ�
 * File:        index.php
 *
 * <pre>
 * ���������ղ������������
 * </pre>
 *
 * @category  PHP
 * @package   Include
 * @author    lizeyu <lizeyu@soufun.com>
 * @copyright 2013 Soufun, Inc.
 * @license   BSD Licence
 * @link      http://example.com
 */

require '../../include/inc.php';

//�������ʹ���ڴ�����
ini_set('memory_limit', '512M');

//���ݹ���
if (!isset($_POST['editorcontent'])) {
    $_GET = array_map('strip_tags', $_GET);
    $_POST = array_map('strip_tags', $_POST);
    $_GET = array_map('htmlspecialchars_for_php54', $_GET);
    $_POST = array_map('htmlspecialchars_for_php54', $_POST);
} else {
    $temp_editorcontent = $_POST['editorcontent'];
    $_GET = array_map('strip_tags', $_GET);
    $_POST = array_map('strip_tags', $_POST);
    $_GET = array_map('htmlspecialchars_for_php54', $_GET);
    $_POST = array_map('htmlspecialchars_for_php54', $_POST);
    $_POST['editorcontent'] = strip_tags($temp_editorcontent, '<p><a><strong><em><span><a><img><br>');
}

//�ַ�ʱ��׽һ�´���ʵ�������д��󶼻�������ͳһ��׽�������
try {
    $con = isset($_REQUEST['c']) ? $_REQUEST['c'] : "my";
    $con_arr = array ('my', 'myesf', 'myjiaju', 'myzf');
    if (in_array($con, $con_arr)) {
        $front = new Front($con);
    }
    //���ݿ������Ͷ������֣��ַ������������ļ���������Ӧ���ֵķ���
    $front->dispatch(_ROOTPATH_.'/include/Controller/');
} catch(Exception $e) {
    $array = array('code'=>$e->getCode(), 'message'=>$e->getMessage(), 'act'=>$front->getActionName());
    exit($array['message']);
}

/* End of file index.php */
