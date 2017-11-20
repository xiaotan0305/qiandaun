<?php
/**
 * Project:     手机搜房
 * File:        index.php
 *
 * <pre>
 * 描述：按照参数进入控制器
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

//设置最大使用内存数量
ini_set('memory_limit', '512M');

//内容过滤
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

//分发时捕捉一下错误。实际上所有错误都会在这里统一捕捉并输出。
try {
    $con = isset($_REQUEST['c']) ? $_REQUEST['c'] : "my";
    $con_arr = array ('my', 'myesf', 'myjiaju', 'myzf');
    if (in_array($con, $con_arr)) {
        $front = new Front($con);
    }
    //根据控制器和动作名字，分发到控制器的文件及调用相应名字的方法
    $front->dispatch(_ROOTPATH_.'/include/Controller/');
} catch(Exception $e) {
    $array = array('code'=>$e->getCode(), 'message'=>$e->getMessage(), 'act'=>$front->getActionName());
    exit($array['message']);
}

/* End of file index.php */
